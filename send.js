require('dotenv').config()
const amqplib = require("amqplib")

const queueName = "hello"
const message = "Hello World"

const sendMsg = async () => {
    const connection = await amqplib.connect(process.env.MQ_PORT)
    const channel = await connection.createChannel();
    // If queue isn't there then assertQueue is going to create a queue.
    // Durable means if our rabbitMQ restarts then it's going to recreate the queue.
    // if RabbitMQ is restart and durable -> true, then it's gonna recreate the queue.
    // AssertQueue checks if there is queue or not.
    await channel.assertQueue(queueName, {durable: false})

    // Default exchange type is Direct Exchange.
    channel.sendToQueue(queueName, Buffer.from(message))

    console.log("[X] Send:", message);
    setTimeout(() => {
        connection.close()
        process.exit()
    }, 500)
}

sendMsg()