const Command = require('../Structures/Command.js')

module.exports = new Command({
    name: "ping",
    description: "smth",

    async run(message, args, client) {
        message.reply(`Ping: ${client.ws.ping} ms.`);
    }
});

// 17:45