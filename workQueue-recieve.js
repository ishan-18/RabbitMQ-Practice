require('dotenv').config()
const amqplib = require("amqplib")

const queueName = "task"

const recieveMsg = async () => {
    const connection = await amqplib.connect(process.env.MQ_PORT)
    const channel = await connection.createChannel();
    // If queue isn't there then assertQueue is going to create a queue.
    // Durable means if our rabbitMQ restarts then it's going to recreate the queue.
    // if RabbitMQ is restart and durable -> true, then it's gonna recreate the queue.
    // AssertQueue checks if there is queue or not.
    await channel.assertQueue(queueName, {durable: true})
    
    // Tasks are distributed among the services in round robin fashion.
    // But there's a problem in round robin approach what if the tasks with completion time 1s 2s 3s are executed by service1
    // And tasks with completion time 9,10 are executed by service2.
    // Now if you see due to round robin service 1 will execute all the tasks before 9 seconds still it will not get the task with com. time 10secs.
    // So to resolve this, there is fair dispatch (prefetch)
    channel.prefetch(1)

    console.log(`Waiting for messages in queue: ${queueName}`);
    channel.consume(queueName, (message) => {
        const secs = message.content.toString().split('.').length - 1;
        console.log(`[X] Recieved: ${message.content.toString()}`);
        setTimeout(() => {
            console.log(`Done resizing image`);

            // We are manually acknowleding because what if one of the services goes down
            // then the task performing by that queue will terminate and user will not get 
            // appropriate response so don't send acknowledgement before the task is completed.
            channel.ack(message)
        }, secs * 1000)
    }, {
        noAck: false
    })
}

recieveMsg()

