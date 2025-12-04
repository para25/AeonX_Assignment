// src/utils/cache.js

const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

async function setCache(key, value, ttl = 300) {
  await redis.set(key, JSON.stringify(value), "EX", ttl);
}


async function getCache(key) {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}


async function deleteCache(key) {
  await redis.del(key);
}

module.exports = {
  setCache,
  getCache,
  deleteCache,
  redis,
};
