import { createQueue } from "kue";

const jobs = createQueue();
const CHANNEL = "push_notification_code";

function sendNotification(phoneNumber, message) {
  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`,
  );
}

jobs.process(CHANNEL, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done();
});
