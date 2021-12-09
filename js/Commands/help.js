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
                commandList += `\n\`.` + file.substring(0,file.length - 3) + `\``
            })

        const embed = new MessageEmbed();

        embed.setTitle('Uno Bot Help!')
            .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
            .setDescription(`
                The Uno Bot prefix is: \`${config.prefix}\`\n
                Type \`.start\` to start a game!\n
                Command List: ${commandList}\n
                \*\*How To Play:\*\*
                 \*\*1.\*\* Have one person type \`.start\` in a Discord server
                 \*\*2.\*\* Have 2-6 players click the \"Join\" button to join the game
                 \*\*3.\*\* Have 1 player click the \"Start\" button to start the game
                 \*\*4.\*\* Everyone will be messaged their initial hand, and the game will begin!`)
            .setColor('RED')
            .setThumbnail(client.user.avatarURL({dynamic:true}))

        message.author.send({embeds: [embed]})

    }
});