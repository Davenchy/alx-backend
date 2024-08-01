import { createClient } from "redis";

const client = createClient()
  .on("connect", () => console.log("Redis client connected to the server"))
  .on("error", (err) =>
    console.log("Redis client not connected to the server:", err.message),
  );

const CHANNEL_NAME = "holberton school channel";

client.subscribe(CHANNEL_NAME);
client.on("message", (channel, msg) => {
  if (channel !== CHANNEL_NAME) {
    return;
  }

  if (msg === "KILL_SERVER") {
    client.unsubscribe();
    process.exit(0);
  }

  console.log(msg);
});
