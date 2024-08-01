import { createQueue } from "kue";

const jobs = createQueue();
const CHANNEL = "push_notification_code";

const jobData = {
  phoneNumber: "not your business",
  message: "not your business, too",
};

const job = jobs.create(CHANNEL, jobData).save((err) => {
  if (!err) console.log("Notification job created:", job.id);
});

job
  .on("complete", () => console.log("Notification job completed"))
  .on("failed", () => console.log("Notification job failed"));
