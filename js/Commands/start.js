const Command = require('../Structures/Command.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "test",
    permission: "SEND_MESSAGES",
    description: "Starts Uno",

    async run(message, args, client) {
        
    }

});