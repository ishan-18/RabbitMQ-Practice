require('dotenv').config()
const amqplib = require("amqplib")

const queueName = "task"
const message = process.argv.slice(2).join(' ') || "Hello World"

const sendMsg = async () => {
    const connection = await amqplib.connect(process.env.MQ_PORT)
    const channel = await connection.createChannel();
    // If queue isn't there then assertQueue is going to create a queue.
    // Durable means if our rabbitMQ restarts then it's going to recreate the queue.
    // if RabbitMQ is restart and durable -> true, then it's gonna recreate the queue.
    // AssertQueue checks if there is queue or not.
    await channel.assertQueue(queueName, {durable: true})

    // Default exchange type is Direct Exchange.
    // Persistent means our queue will respawn as Durable is true then persistent will ensure us that there will be no data loss.
    channel.sendToQueue(queueName, Buffer.from(message), {persistent: true})

    console.log("[X] Send:", message);
    setTimeout(() => {
        connection.close()
        process.exit(0)
    }, 500)
}

sendMsg()