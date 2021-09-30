const Command = require('../Structures/Command')

module.exports = new Command({
    name:"clear",
    description:"Clear an amount of messages",
    permission: "MANAGE_MESSAGES",
    async run(message, args, client) {

        const amount = args[1];
        if (!amount || isNaN(amount)) {
            return message.reply(`${amount} is not a valid number!`);
        }

        // Turns string into int
        const amountParsed = parseInt(amount);

        if (amount > 10) return message.reply(`You cannot clear more than 10 messages.`)

        message.channel.bulkDelete(amountParsed);

        const msg = await message.channel.send(`Cleared ${amountParsed} messages!`);
        setTimeout(() => msg.delete(), 5000);

    }
})