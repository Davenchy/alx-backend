import { createQueue } from "kue";
import { expect } from "chai";
import sinon from "sinon";
import createPushNotificationsJobs from "./8-job";

const queue = createQueue();
const channel = "push_notification_code_3";
const job1 = { message: "job1" };

describe("createPushNotificationsJobs", () => {
  before(() => queue.testMode.enter());
  after(() => queue.testMode.exit());
  beforeEach(() => sinon.spy(console, "log"));
  afterEach(() => {
    sinon.restore();
    queue.testMode.clear();
  });

  it("should throw error for non-array jobs argument", () => {
    expect(() => createPushNotificationsJobs("jobs", queue)).to.throw(
      "Jobs is not an array",
    );
  });

  it("should throw for invalid queue object", () => {
    expect(() => createPushNotificationsJobs([job1], "queue")).to.throw();
  });

  it("should create a job", () => {
    createPushNotificationsJobs([job1], queue);

    const job = queue.testMode.jobs[0];
    const msg = `Notification job created: ${job.id}`;

    expect(queue.testMode.jobs.length).to.equal(1);
    expect(job.type).to.equal(channel);
    expect(job.data).to.deep.equal(job1);
    expect(console.log.calledOnceWith(msg)).to.be.true;
  });

  it("should fail", (done) => {
    createPushNotificationsJobs([job1], queue);

    const job = queue.testMode.jobs[0];
    const msg = `Notification job ${job.id} failed: something bad`;

    job.addListener("failed", () => {
      expect(console.log.calledWith(msg)).to.be.true;
      done();
    });

    job.emit("failed", "something bad");
  });
});
