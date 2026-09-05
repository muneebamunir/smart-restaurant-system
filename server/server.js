require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

/* ✅ AUTH */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Order = require("./models/Order");
const Menu = require("./models/Menu");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= SERVER + SOCKET ================= */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

/* ================= 🔐 FAKE USERS ================= */

const users = [
  { username: "admin", password: "1234", role: "admin" },
  { username: "waiter", password: "1234", role: "waiter" },
  { username: "kitchen", password: "1234", role: "kitchen" }
];
/* ================= 🔐 LOGIN ================= */

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (password !== user.password) {
  return res.status(401).json({ message: "Invalid password" });
}

  const token = jwt.sign(
    { role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    role: user.role
  });
});

/* ================= 🔐 AUTH MIDDLEWARE ================= */

const verifyToken = (roles = []) => {
  return (req, res, next) => {
    const header = req.headers["authorization"];

    if (!header) {
      return res.status(403).json({ message: "No token" });
    }

    // ✅ Expect: "Bearer TOKEN"
    const token = header.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Role check
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = decoded;
      next();

    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

/* ================= WAITER CALL ================= */

let waiterCalls = [];

/* ================= SOCKET ================= */

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

/* ================= MULTER ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/* ================= ROOT ================= */

app.get("/", (req, res) => {
  res.send("Smart Restaurant API running...");
});

/* ================= ORDERS ================= */

/* ✅ Only staff can see orders */
app.get("/orders", verifyToken(["admin", "waiter", "kitchen"]), async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ✅ Create order (customer allowed) */
app.post("/orders", async (req, res) => {
  try {

    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const newOrder = new Order(req.body);
    await newOrder.save();

    io.emit("newOrder", newOrder);

    res.json(newOrder);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ✅ Track order (public) */
app.get("/orders/:id", async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ✅ Only kitchen/admin update status */
app.put("/orders/:id/status",
  verifyToken(["admin", "kitchen"]),
  async (req, res) => {
    try {

      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      io.emit("orderUpdated", updatedOrder);

      res.json(updatedOrder);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* ================= MENU ================= */

/* Public */
app.get("/menu", async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ✅ Only admin can add */
app.post("/menu",
  verifyToken(["admin"]),
  upload.single("image"),
  async (req, res) => {
    try {

      const newItem = new Menu({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        image: req.file ? req.file.filename : null
      });

      await newItem.save();

      res.json(newItem);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* ✅ Only admin delete */
app.delete("/menu/:id",
  verifyToken(["admin"]),
  async (req, res) => {
    try {

      await Menu.findByIdAndDelete(req.params.id);

      res.json({ message: "Item deleted" });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* ================= DATABASE ================= */

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  family: 4,
  tls: true,
  serverSelectionTimeoutMS: 10000
})
.then(() => {
  console.log("🟢 MongoDB Connected");
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("❌ MongoDB connection failed:");
  console.error(err);
});