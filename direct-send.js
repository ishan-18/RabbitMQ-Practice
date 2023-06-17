require('dotenv').config()

const amqplib = require('amqplib')

const exchangeName = "logs"
const message = process.argv.slice(2)
const args = message[1] || "Like, Subscribe and Comment" 
const logType = message[0]

const fanoutSend = async () => {
    const connection = await amqplib.connect(process.env.MQ_PORT)
    const channel = await connection.createChannel()
    await channel.assertExchange(exchangeName,'direct', {durable: false})
    channel.publish(exchangeName, logType, Buffer.from(message))
    console.log(`[X] Send: ${message}`)
}

fanoutSend()

