require('dotenv').config()
const amqplib = require("amqplib")

const args = process.argv.slice(2);
if(args.length === 0){
    console.log(`Usage: direct-recieve.js [info] [warning] [error]`);
    process.exit(1)
}

const exchangeName = "headers-logs"

const recieveMsg = async () => {
    const connection = await amqplib.connect(process.env.MQ_PORT)
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'direct', {durable: false})
    const q = await channel.assertQueue('', {exclusive: true}) // Exclusive means once the connection is terminated, Queue gets deleted
    console.log(`Waiting for messages in queue: ${q.queue}`);
    channel.bindQueue(q.queue, exchangeName, '', {'account': 'new', 'method': 'facebook', 'x-match': 'any'})
    channel.consume(q.queue, (message) => {
        if(message.content){
            console.log(`[X] The Routing key: ${message.fields.routingKey} & The message is ${message.content.toString()}`);
        }
        console.log(`[X] Recieved: ${message.content.toString()}`);
    }, {
        noAck: true
    })
}

recieveMsg()