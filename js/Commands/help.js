const Command = require('../Structures/Command.js')
const {Client, MessageEmbed} = require('discord.js');
const config = require('../Data/config.json');
const fs = require('fs');
let commandList = "";


module.exports = new Command({
    name: "help",
    permission: "SEND_MESSAGES",
    description: "Direct messages a help message",

    async run(message, args, client) {
        commandList = ""
        fs.readdirSync('./js/Commands')
            .filter(file => file.endsWith('.js'))
            .forEach(file => {
                commandList += `\n - \`.` + file.substring(0,file.length - 3) + `\``
            })

        const embed = new MessageEmbed();

        embed.setTitle('Uno Bot Help!')
            .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
            .setDescription(`
                The Uno Bot prefix is: \`${config.prefix}\`\n
                Type \`.start\` to start a game!\n
                Command List: ${commandList}`)
            .setColor('RED')
            .setThumbnail(client.user.avatarURL({dynamic:true}))

        message.author.send({embeds: [embed]})
        message.channel.send({embeds: [embed]})

    }
});