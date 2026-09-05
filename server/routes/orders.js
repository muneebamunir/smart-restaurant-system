const express = require("express");
const Order = require("../models/Order");
const verifyToken = require("../middleware/auth");

module.exports = (io) => {
  const router = express.Router();

  router.get("/", verifyToken(["admin", "waiter", "kitchen"]), async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/", async (req, res) => {
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

  router.get("/:id", async (req, res) => {
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

  router.put(
    "/:id/status",
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

  return router;
};
