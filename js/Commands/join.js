const Command = require('../Structures/Command.js');
const {Client, MessageEmbed} = require('discord.js');
const UnoConfig = require('../Data/uno.json');
const Start = require('../Commands/start.js');

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
                if (UnoConfig.players.p1[0] == null) {
                    UnoConfig.players.p1[0] = message.author.id;
                    UnoConfig.players.p1[1] = message.author.username;
                    embed.setTitle('Player joined!')
                        .setDescription('Player 1 has joined the game.\nThere are 5 spots left.\n1 more player required to begin.');
                    message.channel.send({embeds: [embed]})
                    console.log(UnoConfig.players.p1[1] + " has joined.");
                } else if (UnoConfig.players.p2[0] == null) {
                    UnoConfig.players.p2[0] = message.author.id;
                    UnoConfig.players.p2[1] = message.author.username;
                    embed.setTitle('Player joined!')
                        .setDescription('Player 2 has joined the game.\nThere are 4 spots left.\nType .start to begin.');
                    message.channel.send({embeds: [embed]})
                    console.log(UnoConfig.players.p2[1] + " has joined.");
                } else if (UnoConfig.players.p3[0] == null) {
                    UnoConfig.players.p3[0] = message.author.id;
                    UnoConfig.players.p3[1] = message.author.username;
                    embed.setTitle('Player joined!')
                        .setDescription('Player 3 has joined the game.\nThere are 3 spots left.\nType .start to begin.');
                    message.channel.send({embeds: [embed]})
                    console.log(UnoConfig.players.p3[1] + " has joined.");
                } else if (UnoConfig.players.p4[0] == null) {
                    UnoConfig.players.p4[0] = message.author.id;
                    UnoConfig.players.p4[1] = message.author.username;
                    embed.setTitle('Player joined!')
                        .setDescription('Player 4 has joined the game.\nThere are 2 spots left.\nType .start to begin.');
                    message.channel.send({embeds: [embed]})
                    console.log(UnoConfig.players.p4[1] + " has joined.");
                } else if (UnoConfig.players.p5[0] == null) {
                    UnoConfig.players.p5[0] = message.author.id;
                    UnoConfig.players.p5[1] = message.author.username;
                    embed.setTitle('Player joined!')
                        .setDescription('Player 5 has joined the game.\nThere 1 spot left.\nType .start to begin.');
                    message.channel.send({embeds: [embed]})
                    console.log(UnoConfig.players.p5[1] + " has joined.");
                } else {
                    UnoConfig.players.p6[0] = message.author.id;
                    UnoConfig.players.p6[1] = message.author.username;
                    embed.setTitle('Player joined!')
                        .setDescription('Player 6 has joined the game.\nThere are 0 spots left.\nThe game is starting!');
                    console.log(UnoConfig.players.p6[1] + " has joined.");
                    message.channel.send({embeds: [embed]})
                    Start.run(message, args, client);
                }
                break;
            
            case "PLAYING":
                embed.setDescription('There is a game in progress.\nType \`.stop\` to stop the game.');
                message.channel.send({embeds: [embed]})
                break;
        }

        
        
    }

});