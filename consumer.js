// multipleConsumers.js
const amqp = require("amqplib");

async function receiveMessages(consumerId, connection) {
  try {
    const queue = "hello";
    const channel = await connection.createChannel();
    // 确保队列存在
    await channel.assertQueue(queue, { durable: false });
    console.log(
      `Consumer ${consumerId} is waiting for messages in ${queue}. To exit press CTRL+C`
    );

    // 定义处理消息的回调函数
    channel.consume(
      queue,
      (msg) => {
        console.log(
          `Consumer ${consumerId} received: ${msg.content.toString()}`
        );
        console.log("-------------------------------------");
      },
      { noAck: true }
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

async function startMultipleConsumers(numOfConsumers) {
  const consumerPromises = [];
  // 连接到 RabbitMQ 服务器
  const connection = await amqp.connect("amqp://guest:g@43.163.103.133:5672");

  for (let i = 1; i <= numOfConsumers; i++) {
    consumerPromises.push(receiveMessages(i, connection));
  }

  await Promise.all(consumerPromises);
}

// 设置要启动的消费者数量
const numberOfConsumers = 1; // 可以根据需要调整数量
// startMultipleConsumers(numberOfConsumers);

async function consumeFanoutMessages() {
  const connection = await amqp.connect("amqp://guest:g@43.163.103.133:5672");
  const channel = await connection.createChannel();

  const exchange = "logs"; // 交换机名称
  const queue = "my_direct_queue"; // 指定队列名称

  // 声明一个 fanout 类型的交换机
  await channel.assertExchange(exchange, "fanout", { durable: true });

  // 声明指定名称的队列
  await channel.assertQueue(queue, { durable: true });

  // 将指定队列绑定到交换机
  await channel.bindQueue(queue, exchange, "");

  console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

  // 消费消息
  channel.consume(
    queue,
    (msg) => {
      if (msg !== null) {
        console.log(`[x] Received: ${msg.content.toString()}`);
        channel.ack(msg); // 确认消息已被处理
      }
    },
    { noAck: false }
  ); // 设置不自动确认消息
}

// consumeFanoutMessages().catch(console.error);


async function consumeDirectMessages() {
  const connection = await amqp.connect("amqp://guest:g@43.163.103.133:5672");
  const channel = await connection.createChannel();

  const exchange = "direct_logs"; // 交换机名称
  const queue = "direct_logs_queue"; // 指定队列名称
  const routingKey = "info"; // 路由键

  // 声明一个 fanout 类型的交换机
  await channel.assertExchange(exchange, "direct", { durable: true });

  // 声明指定名称的队列
  await channel.assertQueue(queue, { durable: true });

  // 将指定队列绑定到交换机
  await channel.bindQueue(queue, exchange, routingKey);

  console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

  // 消费消息
  channel.consume(
    queue,
    (msg) => {
      if (msg !== null) {
        console.log(`[x] Received: ${msg.content.toString()}`);
        channel.ack(msg); // 确认消息已被处理
      }
    },
    { noAck: false }
  ); // 设置不自动确认消息
}

// consumeDirectMessages().catch(console.error);
