const Command = require('../Structures/Command.js');
const {Client, MessageEmbed} = require('discord.js');
const UnoConfig = require('../Data/uno.json');
const Start = require('../Commands/start.js');

// Currently an unused file

module.exports = new Command({
    name: "join",
    permission: "SEND_MESSAGES",
    description: "Used to join an Uno Game",

    async run(message, args, client) {
        const embed = new MessageEmbed();
        embed.setTitle('Error!')
            .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
            .setColor('RED')
            .setThumbnail(client.user.avatarURL({dynamic:true}))

        switch (UnoConfig.currentState) {
            case "WAITING":
                embed.setDescription('A game has not been started.\nType \`.start\` to start a game.');
                message.channel.send({embeds: [embed]})
                break;

            case "JOINING":
                console.log(Object.keys(UnoConfig.players).length);
                if (Object.keys(UnoConfig.players).length <= 5) {
                    UnoConfig.playerCount++;

                    UnoConfig.players[UnoConfig.playerCount] = [message.author.id, message.author.username];
                    console.log(UnoConfig.players[UnoConfig.playerCount]);
                    embed.setTitle('Player Joined!');
                    if (UnoConfig.playerCount == 1) {
                        embed.setDescription(`Player ${UnoConfig.playerCount} has joined the game.\n
                            There are ${6 - UnoConfig.playerCount} spots left.\n
                            1 more player required to begin.`)
                    } else if (UnoConfig.playerCount == 6) {
                        embed.setDescription(`Player ${UnoConfig.playerCount} has joined the game.\n
                            There are 0 spots left.
                            The game is starting!`);
                        Start.run(message, args, client);
                    } else {
                        embed.setDescription(`Player ${UnoConfig.playerCount} has joined the game.\n
                            There are ${6 - UnoConfig.playerCount} spots left.\n`)
                    }

                }
                message.channel.send({embeds: [embed]})
                break;
            
            case "PLAYING":
                embed.setDescription('There is a game in progress.\nType \`.stop\` to stop the game.');
                message.channel.send({embeds: [embed]})
                break;
        }

        
        
    }

});