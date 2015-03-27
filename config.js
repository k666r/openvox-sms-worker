module.exports = {
    'openvox-sms': {
        host: '192.168.243.125',
        port: 5038,
        username: 'admin',
        password: 'admin'
    },
    amqp: {
        url: 'amqp://localhost',
        queue: 'task_queue'
    },
    logger: {
        file: {
            filename: '/var/log/openvox-sms-worker.log',
            json: false
        },
        console: {
            colorize: true
        }
    }
};