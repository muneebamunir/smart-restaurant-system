require("dotenv").config();
const mongoose = require("mongoose");
const config = require("./config");
const Menu = require("./models/menu");

const menuItems = [
  { name: "Chicken Handi", price: 850, category: "Main Course", image: "1773224615879.png" },
  { name: "Tikka", price: 350, category: "Appetizers", image: "1773226176422.png" },
  { name: "Seek Kabab", price: 400, category: "Appetizers", image: "1773226353353.png" },
  { name: "Fries", price: 200, category: "Appetizers", image: "1773245489626.png" },
  { name: "Wrap", price: 450, category: "Fast Food", image: "1773245744795.png" },
  { name: "Mutton Handi", price: 1200, category: "Main Course", image: "1773246083331.png" },
  { name: "Mint Raita", price: 100, category: "Sides", image: "1773563424883.png" },
  { name: "Salad", price: 150, category: "Sides", image: "1773563483049.png" },
  { name: "Zinger Burger", price: 550, category: "Fast Food", image: "1786288305348.png" },
  { name: "Crunch Burger", price: 500, category: "Fast Food", image: "1786288434798.png" },
  { name: "Pizza", price: 800, category: "Fast Food", image: "1786288524609.png" },
  { name: "Baryani", price: 600, category: "Main Course", image: "1786288950474.png" },
  { name: "Chicken Krahi", price: 900, category: "Main Course", image: "1786289059645.png" },
  { name: "Beef Krahi", price: 950, category: "Main Course", image: "1786289142620.png" },
  { name: "Coca Cola", price: 120, category: "Beverages", image: "1786289871549.png" },
  { name: "Sprite", price: 120, category: "Beverages", image: "1786289892172.png" },
  { name: "Water", price: 80, category: "Beverages", image: "1786289917217.png" }
];

async function seedMenu() {
  try {
    await mongoose.connect(process.env.MONGO_URI, config.mongoOptions);
    console.log("🟢 Connected to MongoDB");

    // Optional: Delete all existing items before seeding (uncomment if needed)
    // await Menu.deleteMany({});
    // console.log("🧹 Cleared existing menu");

    const inserted = await Menu.insertMany(menuItems);
    console.log(`✅ Successfully added ${inserted.length} items to the Menu.`);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
}

seedMenu();