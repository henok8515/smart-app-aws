require("dotenv").config();

const memjs = require("memjs");

// Detect environment
// Use LOCAL_MEMCACHED env var to force local testing
const isLocal = process.env.LOCAL_MEMCACHED === "true";

let cache;

if (isLocal) {
  console.log("Using local Memcached...");
  // Local Memcached (for testing on your machine)
  cache = memjs.Client.create("127.0.0.1:11211", { timeout: 5000 });
} else {
  console.log("Using AWS ElastiCache Memcached...");
  // AWS ElastiCache endpoint
  // Set this in your env: ELASTICACHE_ENDPOINT
  const endpoint = process.env.ELASTICACHE_ENDPOINT;
  if (!endpoint) {
    throw new Error("ELASTICACHE_ENDPOINT environment variable is not set!");
  }
  cache = memjs.Client.create(`${endpoint}:11211`, { timeout: 5000 });
}

module.exports = cache;
