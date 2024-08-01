import { createClient, print } from "redis";

const client = createClient()
  .on("connect", () => console.log("Redis client connected to the server"))
  .on("error", (err) =>
    console.log("Redis client not connected to the server:", err.message),
  );

const KEY = "HolbertonSchools";

client
  .MULTI()
  .HSET(KEY, "Portland", 50, print)
  .HSET(KEY, "Seattle", 80, print)
  .HSET(KEY, "New York", 20, print)
  .HSET(KEY, "Bogota", 20, print)
  .HSET(KEY, "Cali", 40, print)
  .HSET(KEY, "Paris", 2, print)
  .EXEC();

client.HGETALL(KEY, (_, values) => console.log(values));
