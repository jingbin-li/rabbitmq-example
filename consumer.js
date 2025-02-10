// consumer.js
const amqp = require("amqplib");

async function receiveMessages() {
  const queue = "hello";

  try {
    // 连接到 RabbitMQ 服务器
    const connection = await amqp.connect("amqp://guest:g@43.163.103.133:5672");
    const channel = await connection.createChannel();

    // 确保队列存在
    await channel.assertQueue(queue, { durable: false });

    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

    // 定义处理消息的回调函数
    channel.consume(
      queue,
      (msg) => {
        console.log(`Received: ${msg.content.toString()}`);
        console.log("-------------------------------------");
      },
      { noAck: true }
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

receiveMessages();
