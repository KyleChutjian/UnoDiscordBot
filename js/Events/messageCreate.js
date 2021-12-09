const Event = require('../Structures/Event.js')
const Discord = require('discord.js');

module.exports = new Event('messageCreate', (client, message) => {

    if (!message.content.startsWith(client.prefix)) return;
    
    for (letterIndex in message.content) {
        if (message.content[letterIndex] == client.prefix && letterIndex > 0) {
            return message.reply(`You cannot use \`${client.prefix}\` more than once while using a command!`);
        }
    }

    const args = message.content.substring(client.prefix.length).split(/ +/)

    const command = client.commands.find(cmd => cmd.name == args[0]);

    if (!command) return message.reply(`${args[0]} is not a valid command!`)
    if (message.channel instanceof Discord.DMChannel) {
        // console.log('dm!'); // testing purposes

    } else {
        const permission = message.member.permissions.has(command.permission);
        if (!permission) return message.reply(`You do not have the permission to \`${command.permission}\` to run this command!`)
    
    }

    command.run(message, args, client);



});