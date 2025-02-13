const amqp = require("amqplib");

async function sendFanoutMessage() {
  const connection = await amqp.connect("amqp://guest:g@43.163.103.133:5672");
  const channel = await connection.createChannel();

  const exchange = "logs"; // 交换机名称
  const msg = "Hello, this is a broadcast message!";

  // 声明一个 fanout 类型的交换机
  await channel.assertExchange(exchange, "fanout", { durable: true });

  // 发布消息到交换机，不需要路由键
  channel.publish(exchange, "", Buffer.from(msg));

  console.log(`[x] Sent: ${msg}`);

  setTimeout(() => {
    channel.close();
    connection.close();
  }, 500);
}

sendFanoutMessage().catch(console.error);
