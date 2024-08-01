import express from "express";
import { promisfy } from "promisfy";
import { createClient } from "redis";
import { createQueue } from "kue";

const INITIAL_SEATS = 5;
const CHANNEL = "reserve_seat";

const client = createClient();
const queue = createQueue();

const clientSetAsync = promisfy(client.set, client);
const clientGetAsync = promisfy(client.get, client);

const app = express();
let reservationEnabled = true;

queue
  .on("job complete", (id) =>
    console.log(`Seat reservation job ${id} completed`),
  )
  .on("job failed", (id, err) =>
    console.log(`Seat reservation job ${id} failed: ${err}`),
  );

async function reserveSeat(number) {
  return clientSetAsync("available_seats", number);
}

async function getCurrentAvailableSeats() {
  return Number.parseInt(
    (await clientGetAsync("available_seats")) || INITIAL_SEATS,
  );
}

app.use((_, res, next) => {
  res.json = (body) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(body));
  };
  next();
});

app.get("/available_seats", async (_, res) => {
  res.json({ numberOfAvailableSeats: await getCurrentAvailableSeats() });
});

app.get("/reserve_seat", async (_, res) => {
  if (!reservationEnabled) {
    return res.json({ status: "Reservation are blocked" });
  }

  queue.create(CHANNEL).save((err) => {
    if (err) {
      res.json({ status: "Reservation failed" });
    } else {
      res.json({ status: "Reservation in process" });
    }
  });
});

app.get("/process", (_, res) => {
  queue.process(CHANNEL, async (_, done) => {
    const seats = await getCurrentAvailableSeats();
    if (seats > 0) {
      if (seats === 1) {
        reservationEnabled = false;
      }

      await reserveSeat(seats - 1);
      done();
    } else {
      done(new Error("Not enough seats available"));
    }
  });

  res.json({ status: "Queue processing" });
});

client.flushdb(() =>
  app.listen(1245, () => console.log("server is running on port 1245")),
);
