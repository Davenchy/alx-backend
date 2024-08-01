const channel = "push_notification_code_3";

export default function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error("Jobs is not an array");
  }

  for (const jobObj of jobs) {
    const job = queue.create(channel, jobObj).save((err) => {
      if (!err) console.log("Notification job created:", job.id);
    });

    const { id } = job;

    job
      .on("complete", () => console.log("Notification job %d completed", id))
      .on("failed", (err) =>
        console.log("Notification job %d failed: %s", id, err),
      )
      .on("progress", (progress) =>
        console.log("Notification job %d %d%% complete", id, progress),
      );
  }
}
