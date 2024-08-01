import { createClient, print } from "redis";

const client = createClient({ url: "redis://127.0.0.1:6379" })
  .on("connect", () => console.log("Redis client connected to the server"))
  .on("error", (err) =>
    console.error("Redis client not connected to the server:", err.message),
  );

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
}

function displaySchoolValue(schoolName) {
  client.get(schoolName, (_, value) => console.log(value));
}

displaySchoolValue("Holberton");
setNewSchool("HolbertonSanFrancisco", "100");
displaySchoolValue("HolbertonSanFrancisco");
