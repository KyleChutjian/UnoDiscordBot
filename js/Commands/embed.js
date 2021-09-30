const Command = require('../Structures/Command.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "embed",
    description: "Shows an embed",
    permission: "ADMINISTRATOR",
    async run(message, args, client) {

        const embed = new Discord.MessageEmbed();

        embed.setTitle('This is a test embed')
            .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}), 'https://github.com/KyleChutjian/UnoDiscordBot')
            .setDescription('This is a description,\n you can edit this later. Link: [GitHub](https://github.com/KyleChutjian/UnoDiscordBot).')
            .setColor('RED')
            .setThumbnail(client.user.avatarURL({dynamic:true}))
            .setTimestamp(message.createdTimestamp)
            .setImage('https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png')
            .addFields({
                name:"Bot Version",
                value:"1.0.0",
                inline: true
            }, {
                name: "Bot Name",
                value: client.user.username,
                inline: true
            })
        ;

        message.channel.send({embeds: [embed]});
    }
})