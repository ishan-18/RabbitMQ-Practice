require('dotenv').config()

const amqplib = require('amqplib')

const exchangeName = "wdj"
const message = process.argv.slice(2).join(' ') || "Like, Subscribe and Comment"

const fanoutSend = async () => {
    const connection = await amqplib.connect(process.env.MQ_PORT)
    const channel = await connection.createChannel()
    await channel.assertExchange(exchangeName,'fanout', {durable: false})
    channel.publish(exchangeName, '', Buffer.from(message))
    console.log(`[X] Send: ${message}`)
}

fanoutSend()

