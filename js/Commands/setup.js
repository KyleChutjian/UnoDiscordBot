const Command = require('../Structures/Command.js')

module.exports = new Command({
    name: "ping",
    permission: "SEND_MESSAGES",
    description: "smth",

    async run(message, args, client) {
        message.reply(`Ping: ${client.ws.ping} ms.`);
    }
});