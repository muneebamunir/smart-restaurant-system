require("dotenv").config();
const mongoose = require("mongoose");
const config = require("./config");

const Menu = require("./models/Menu");
const Order = require("./models/Order");
const User = require("./models/User");

const models = [
  { name: "Menu", model: Menu },
  { name: "Order", model: Order },
  { name: "User", model: User }
];

async function migrate() {
  const uri = process.env.MIGRATE_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ Set MONGO_URI (or MIGRATE_URI) in server/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, config.mongoOptions);

    const dbName = mongoose.connection.db.databaseName;
    console.log(`🟢 Connected to database: ${dbName}`);

    for (const { name, model } of models) {
      await model.createCollection();
      await model.syncIndexes();
      console.log(`✅ Schema ready: ${name} → collection "${model.collection.name}"`);
    }

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("\n📦 Collections in database:");
    collections.forEach(({ name }) => console.log(`   - ${name}`));

    console.log("\n🎉 Migration completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:");
    console.error(error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

migrate();
