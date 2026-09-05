const express = require("express");
const Menu = require("../models/Menu");
const verifyToken = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/",
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

router.delete("/:id", verifyToken(["admin"]), async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);

    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
