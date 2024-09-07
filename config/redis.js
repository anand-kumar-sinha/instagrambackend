const Redis = require("ioredis");

const redis = new Redis({
  host: "redis-17558.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com",
  port: 17558,
  password: "KMw2f31zBRKYuvYCPhABR8NYe4PbuDwB",
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

module.exports = redis;
