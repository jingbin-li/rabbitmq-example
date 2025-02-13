// producer.js
const amqp = require("amqplib");

async function sendMessage() {
  const queue = "hello";
  const msg = "Hello World! What is your name?";

  try {
    // 连接到 RabbitMQ 服务器
    const connection = await amqp.connect("amqp://guest:g@43.163.103.133:5672");
    const channel = await connection.createChannel();

    // 确保队列存在
    await channel.assertQueue(queue, { durable: false });

    for (let i = 1; i <= 10; i++) {
      // 发送消息
      channel.sendToQueue(queue, Buffer.from(`${i}-${msg}`));
      console.log(`Sent: ${i}-${msg}`);
    }

    // 关闭连接
    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error:", error);
  }
}

sendMessage();
