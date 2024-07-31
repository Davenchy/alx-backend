import { createClient, print } from "redis";

(async () => {
  const client = await createClient({ url: "redis://127.0.0.1:6379" })
    .on("connect", () => console.log("Redis client connected to the server"))
    .on("error", (err) =>
      console.error("Redis client not connected to the server:", err.message),
    )
    .connect();

  async function setNewSchool(schoolName, value) {
    await client.set(schoolName, value, print);
  }

  async function displaySchoolValue(schoolName) {
    const value = await client.get(schoolName);
    console.log(value);
    return value;
  }

  await displaySchoolValue("Holberton");
  await setNewSchool("HolbertonSanFrancisco", "100");
  await displaySchoolValue("HolbertonSanFrancisco");

  await client.disconnect();
})();
