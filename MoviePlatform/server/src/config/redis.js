const Redis = require("ioredis");

const redisClient = new Redis({

  host: process.env.REDIS_HOST?.trim() || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD?.trim() || undefined,

});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("Connected to Redis"));

module.exports = {
  redisClient
};
