import { createClient, print } from "redis";
import { promisfy } from "promisfy";

const client = createClient({ url: "redis://127.0.0.1:6379" })
  .on("connect", () => console.log("Redis client connected to the server"))
  .on("error", (err) =>
    console.error("Redis client not connected to the server:", err.message),
  );

const clientGetAsync = promisfy(client.get, client);

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
}

async function displaySchoolValue(schoolName) {
  const value = await clientGetAsync(schoolName);
  console.log(value);
}

(async () => {
  await displaySchoolValue("Holberton");
  setNewSchool("HolbertonSanFrancisco", "100");
  await displaySchoolValue("HolbertonSanFrancisco");
})();
