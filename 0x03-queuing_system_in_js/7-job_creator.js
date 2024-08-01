import { createQueue } from "kue";

const queue = createQueue();
const channel = "push_notification_code_2";
const jobs = [
  {
    phoneNumber: "4153518780",
    message: "This is the code 1234 to verify your account",
  },
  {
    phoneNumber: "4153518781",
    message: "This is the code 4562 to verify your account",
  },
  {
    phoneNumber: "4153518743",
    message: "This is the code 4321 to verify your account",
  },
  {
    phoneNumber: "4153538781",
    message: "This is the code 4562 to verify your account",
  },
  {
    phoneNumber: "4153118782",
    message: "This is the code 4321 to verify your account",
  },
  {
    phoneNumber: "4153718781",
    message: "This is the code 4562 to verify your account",
  },
  {
    phoneNumber: "4159518782",
    message: "This is the code 4321 to verify your account",
  },
  {
    phoneNumber: "4158718781",
    message: "This is the code 4562 to verify your account",
  },
  {
    phoneNumber: "4153818782",
    message: "This is the code 4321 to verify your account",
  },
  {
    phoneNumber: "4154318781",
    message: "This is the code 4562 to verify your account",
  },
  {
    phoneNumber: "4151218782",
    message: "This is the code 4321 to verify your account",
  },
];

queue
  .on("job complete", (id) => console.log("Notification job #%d completed", id))
  .on("job failed", (id, err) =>
    console.log("Notification job #%d failed: %s", id, err),
  )
  .on("job progress", (id, progress) =>
    console.log("Notification job #%d %d%% compete", id, progress),
  );

for (const jobObj of jobs) {
  const job = queue.create(channel, jobObj).save((err) => {
    if (!err) console.log("Notification job created:", job.id);
  });
}
