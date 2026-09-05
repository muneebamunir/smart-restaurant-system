require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const config = require("./config");
const authRoutes = require("./routes/auth");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");
const setupSocket = require("./routes/socket");

const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.clientOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.get("/", (req, res) => {
  res.send("Smart Restaurant API running...");
});

app.use("/auth", authRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes(io));

setupSocket(io);

mongoose
  .connect(process.env.MONGO_URI, config.mongoOptions)
  .then(() => {
    console.log("🟢 MongoDB Connected");
    server.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:");
    console.error(err);
  });
