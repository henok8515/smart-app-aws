// const amqp = require("amqplib");

// let channel;

// async function connectRabbit() {
//   const conn = await amqp.connect(
//     "amqps://HenokEgezew:he&0943851525@b-99211366-1d8d-496f-9514-737c3de0a21e.mq.us-east-1.on.aws:5671"
//   );

//   const channel = await conn.createChannel();
//   await channel.assertQueue("task_queue", { durable: true });

//   return channel;
// }

// async function sendToQueue(msg) {
//   channel.sendToQueue("task_queue", Buffer.from(JSON.stringify(msg)));
// }

// module.exports = { connectRabbit, sendToQueue };

const amqp = require("amqplib");

let channel = null;

async function connectRabbit() {
  const RABBITMQ_URL = process.env.RABBITMQ_URL;

  if (!RABBITMQ_URL) {
    throw new Error("❌ RABBITMQ_URL not set");
  }

  const connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertQueue("task_queue", { durable: true });

  console.log("✅ RabbitMQ connected");
}

function sendToQueue(message) {
  if (!channel) {
    console.error("❌ RabbitMQ channel not ready");
    return;
  }

  channel.sendToQueue("task_queue", Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
}

module.exports = { connectRabbit, sendToQueue };
