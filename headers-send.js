require('dotenv').config()

const amqplib = require('amqplib')

const exchangeName = "headers-logs"
const message = process.argv.slice(2)
const args = message[1] || "Like, Subscribe and Comment" 
const logType = message[0]

const fanoutSend = async () => {
    const connection = await amqplib.connect(process.env.MQ_PORT)
    const channel = await connection.createChannel()
    await channel.assertExchange(exchangeName,'headers', {durable: false})
    channel.publish(exchangeName, '', Buffer.from(message), {headers: {account: 'new', method: 'google'}})
    console.log(`[X] Send: ${message}`)
}

fanoutSend()

