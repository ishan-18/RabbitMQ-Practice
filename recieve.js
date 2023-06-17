require('dotenv').config()
const amqplib = require("amqplib")

const queueName = "hello"

const recieveMsg = async () => {
    const connection = await amqplib.connect(process.env.MQ_PORT)
    const channel = await connection.createChannel();
    // If queue isn't there then assertQueue is going to create a queue.
    // Durable means if our rabbitMQ restarts then it's going to recreate the queue.
    // if RabbitMQ is restart and durable -> true, then it's gonna recreate the queue.
    // AssertQueue checks if there is queue or not.
    await channel.assertQueue(queueName, {durable: false})

    console.log(`Waiting for messages in queue: ${queueName}`);
    channel.consume(queueName, (message) => {
        console.log(`[X] Recieved: ${message.content.toString()}`);
    }, {
        noAck: true
    })
}

recieveMsg()