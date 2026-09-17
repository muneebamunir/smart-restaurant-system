/**
 * migrate.ts — root of the repo
 * Run with:  npm run migrate
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

/* ──────────────────────────────────────────────────────────
   Import every model. Correct path is ./models/… because this
   script lives at the repo root alongside the models folder.
   ────────────────────────────────────────────────────────── */
import User from './models/user';
import Category from './models/category';
import Item from './models/item';
import Order from './models/order';
import Offer from './models/offer';
import Subscriber from './models/subscriber';
import Review from './models/review';
import Table from './models/table';
import Settings from './models/settings';

const MODELS = [
  User,
  Category,
  Item,
  Order,
  Offer,
  Subscriber,
  Review,
  Table,
  Settings,
];

/* ──────────────────────────────────────────────────────────
   Main
   ────────────────────────────────────────────────────────── */
async function main() {
  const targetUri = process.env.MONGO_URI;
  const sourceUri = process.env.SOURCE_MONGO_URL;

  if (!targetUri) {
    console.error('❌ MONGO_URL is not set in .env');
    process.exit(1);
  }

  console.log(`\n▶ Target database: ${maskUri(targetUri)}\n`);

  /* ── Step 1: Copy data (optional) ───────────────────── */
  if (sourceUri) {
    console.log('▶ Copying data from source database…');
    console.log(`  source: ${maskUri(sourceUri)}`);
    await copyCollections(sourceUri, targetUri);
    console.log('');
  } else {
    console.log('i  SOURCE_MONGO_URL not set — skipping data copy.\n');
  }

  /* ── Step 2: Bootstrap schema ───────────────────────── */
  console.log('▶ Bootstrapping schema (collections + indexes)…');
  await mongoose.connect(targetUri, { bufferCommands: false });

  for (const Model of MODELS) {
    try {
      await Model.syncIndexes();
      console.log(`  ✓ ${Model.modelName}`);
    } catch (e) {
      console.error(`  ✗ ${Model.modelName}: ${(e as Error).message}`);
      throw e;
    }
  }

  /* ── Step 3: Seed Settings singleton ────────────────── */
  console.log('\n▶ Ensuring Settings singleton exists…');
  const settings = await (Settings as any).get();
  console.log(`  ✓ Settings document: ${settings._id}`);

  console.log('\n✅ Migration complete.\n');
  await mongoose.disconnect();
}

/* ──────────────────────────────────────────────────────────
   Copy collections via the native driver — preserves _id,
   dates, nested docs, and BSON types exactly.
   ────────────────────────────────────────────────────────── */
async function copyCollections(sourceUri: string, targetUri: string) {
  const src = new MongoClient(sourceUri);
  const dst = new MongoClient(targetUri);

  try {
    await src.connect();
    await dst.connect();

    const srcDb = src.db();
    const dstDb = dst.db();

    const collections = await srcDb.listCollections().toArray();
    if (collections.length === 0) {
      console.log('  (source database is empty)');
      return;
    }

    for (const col of collections) {
      const docs = await srcDb.collection(col.name).find({}).toArray();

      if (docs.length === 0) {
        console.log(`  · ${col.name.padEnd(20)} empty, skipped`);
        continue;
      }

      await dstDb.collection(col.name).deleteMany({});
      await dstDb.collection(col.name).insertMany(docs, { ordered: false });

      console.log(`  · ${col.name.padEnd(20)} ${docs.length} document(s) copied`);
    }
  } finally {
    await src.close();
    await dst.close();
  }
}

/* ──────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────── */
function maskUri(uri: string) {
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
}

/* ──────────────────────────────────────────────────────────
   Entry point
   ────────────────────────────────────────────────────────── */
main().catch((e) => {
  console.error('\n❌ Migration failed:\n', e);
  process.exit(1);
});