const Command = require('../Structures/Command.js');
const {Client, MessageEmbed, Message} = require('discord.js');
const UnoConfig = require('../Data/uno.json');

module.exports = new Command({
    name: "stop",
    permission: "SEND_MESSAGES",
    description: "This stops any ongoing games",

    async run(message, args, client) {
        const embed = new MessageEmbed();
        embed.setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
            .setColor('RED')
            .setThumbnail(client.user.avatarURL({dynamic:true}))
        
        switch (UnoConfig.currentState) {
            case "WAITING":
                embed.setTitle('Error!')
                    .setDescription(`There is no ongoing game.`);
                break;
            
            case "JOINING":
                embed.setTitle('Game Stopped!')
                    .setDescription(`The game has stopped.\n
                    Type \`.start\` to start another game.`);
                    for (player in UnoConfig.players) {
                        UnoConfig.players[player] = [null, null];
                    }
                    UnoConfig.currentState = "WAITING";

                break;

            case "PLAYING":
                embed.setTitle('Game Stopped!')
                    .setDescription(`The game has stopped.\n
                    Type \`.start\` to start another game.`);
                    UnoConfig.players = {
                        
                    };
                    UnoConfig.playerCount = 0;
                    // for (player in UnoConfig.players) {
                    //     UnoConfig.players[player] = [null, null];
                    // }
                    UnoConfig.currentState = "WAITING";
                break;
        }
        


        message.channel.send({embeds: [embed]})
    }

});