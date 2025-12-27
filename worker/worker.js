const amqp = require("amqplib");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://HenokEgezew:he0943851525@vpofile.ejxkb2i.mongodb.net/"
);

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    title: String,
    status: String,
  })
);

async function start() {
  const conn = await amqp.connect(
    "amqps://HenokEgezew:he&0943851525@b-99211366-1d8d-496f-9514-737c3de0a21e.mq.us-east-1.on.aws:5671"
  );
  const channel = await conn.createChannel();
  await channel.assertQueue("task_queue");

  channel.consume("task_queue", async (msg) => {
    const { taskId } = JSON.parse(msg.content.toString());

    await Task.findByIdAndUpdate(taskId, { status: "processing" });
    setTimeout(async () => {
      await Task.findByIdAndUpdate(taskId, { status: "completed" });
      channel.ack(msg);
    }, 5000);
  });
}

start();
