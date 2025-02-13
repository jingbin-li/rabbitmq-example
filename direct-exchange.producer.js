const amqp = require("amqplib");

async function sendDirectMessage() {
  const connection = await amqp.connect("amqp://guest:g@43.163.103.133:5672");
  const channel = await connection.createChannel();

  const exchange = "direct_logs";
  const routingKey = "info"; // 路由键
  const msg = "Hello, this is an info log!";

  await channel.assertExchange(exchange, "direct", { durable: true });
  channel.publish(exchange, routingKey, Buffer.from(msg));

  console.log(`[x] Sent ${msg} with routing key "${routingKey}"`);

  setTimeout(() => {
    channel.close();
    connection.close();
  }, 500);
}

sendDirectMessage();
