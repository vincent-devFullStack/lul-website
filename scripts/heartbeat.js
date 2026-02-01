/* eslint-disable no-console */
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { fileURLToPath } from "url";
import { resolve } from "path";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local" });
}

const uri = process.env.MONGODB_URI;
const shouldLog = process.env.HEARTBEAT_LOG === "1";

if (!uri) {
  console.error("[heartbeat] MONGODB_URI is missing");
  process.exit(1);
}

export async function runHeartbeat() {
  if (shouldLog) {
    console.log(`[heartbeat] start ${new Date().toISOString()}`);
  }
  const client = new MongoClient(uri, {
    maxPoolSize: 1,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  });

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    if (shouldLog) {
      console.log(`[heartbeat] ok ${new Date().toISOString()}`);
    }
  } catch (err) {
    console.error("[heartbeat] failed", err);
    process.exitCode = 1;
  } finally {
    try {
      await client.close();
    } catch (closeErr) {
      console.error("[heartbeat] close failed", closeErr);
      process.exitCode = 1;
    }
  }
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) {
  const timeout = setTimeout(() => {
    console.error("[heartbeat] timeout");
    process.exit(1);
  }, 10000);

  runHeartbeat()
    .catch((err) => {
      console.error("[heartbeat] unhandled", err);
      process.exit(1);
    })
    .finally(() => {
      clearTimeout(timeout);
      process.exit(process.exitCode || 0);
    });
}
