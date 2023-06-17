require('dotenv').config()
const amqplib = require("amqplib")

const exchangeName = "wdj"

const recieveMsg = async () => {
    const connection = await amqplib.connect(process.env.MQ_PORT)
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'fanout', {durable: false})
    const q = await channel.assertQueue('', {exclusive: true}) // Exclusive means once the connection is terminated, Queue gets deleted
    console.log(`Waiting for messages in queue: ${q.queue}`);
    channel.bindQueue(q.queue, exchangeName, '')

    channel.consume(q.queue, (message) => {
        if(message.content){
            console.log(`[X] The message is ${message.content.toString()}`);
        }
        console.log(`[X] Recieved: ${message.content.toString()}`);
    }, {
        noAck: true
    })
}

recieveMsg()