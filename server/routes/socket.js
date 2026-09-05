let waiterCalls = [];

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("callWaiter", (data) => {
      if (!data || !data.tableNumber) return;

      waiterCalls.push({
        ...data,
        socketId: socket.id
      });

      io.emit("waiterAlert", data);
    });

    socket.on("clearWaiterCall", (tableNumber) => {
      waiterCalls = waiterCalls.filter(
        (c) => c.tableNumber !== tableNumber
      );

      io.emit("waiterCallCleared", tableNumber);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};
