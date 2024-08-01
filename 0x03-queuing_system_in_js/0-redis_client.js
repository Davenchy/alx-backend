import { createClient } from "redis";

createClient({ url: "redis://127.0.0.1:6379" })
  .on("connect", () => console.log("Redis client connected to the server"))
  .on("error", (err) =>
    console.error("Redis client not connected to the server:", err.message),
  );
