const Command = require('../Structures/Command.js')

module.exports = new Command({
    name: "setup",
    permission: "SEND_MESSAGES",
    description: "Sets configs for Uno and Bot",

    async run(message, args, client) {
        switch (args[1].toLowerCase()) {
            case 'bot':
                message.channel.send('Starting config for BOT');
                break;
            case 'uno':
                message.channel.send('Starting config for UNO');
                
                break;
            default:
                message.channel.send('Invalid arguments. To use type: \`.setup bot\` to change the bot configs, or \`.setup uno\` to change the settings for the next Uno game.');
        }

    }
});