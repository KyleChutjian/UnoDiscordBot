const Command = require('../Structures/Command.js');
const {Client, MessageEmbed} = require('discord.js');
const UnoConfig = require('../Data/uno.json');
const Game = require('../Structures/Game.js');

module.exports = new Command({
    name: "uno",
    permission: "SEND_MESSAGES",
    description: "Player uses this command to tell everyone that they have 1 card left",

    async run(message, args, client) {
        const dmEmbed = new MessageEmbed();
        const channelEmbed = new MessageEmbed();
        if (UnoConfig.currentState != "PLAYING") return;
        
        if (message.channel.id == UnoConfig.channelId) {
            // Checking if the last person said Uno or not
            console.log(`${message.author.username} is challenging ${UnoConfig.players[UnoConfig.lastPlayer].username}`);
            if (UnoConfig.players[UnoConfig.lastPlayer].hand.length == 1 && !UnoConfig.players[UnoConfig.lastPlayer].saidUno) {
                console.log(`Challenge successful! ${UnoConfig.players[UnoConfig.lastPlayer].username} has to draw 2.`);
                UnoConfig.players[UnoConfig.lastPlayer].hand.push(Game.getRandomCard());
                UnoConfig.players[UnoConfig.lastPlayer].hand.push(Game.getRandomCard());

                dmEmbed.setTitle('You Drew 2 Cards!')
                    .setDescription(`${message.author.username} has called you out for not saying Uno when you have 1 card left!\n
                    Next time, type \`.uno\` before playing your second-to-last card!`)
                    .setColor('RED')
                
                channelEmbed.setTitle(`${UnoConfig.players[UnoConfig.lastPlayer].username} drew two cards!`)
                    .setDescription(`${UnoConfig.players[UnoConfig.lastPlayer].username} did not say Uno when they had 1 card left!\n
                        Reminder: type \`.uno\` before playing your second-to-last card!`)
                    .setColor('RED')
                client.users.cache.get(UnoConfig.lastPlayer).send({embeds:[dmEmbed]});
                

            } else {
                console.log(`Challenge unsuccessful! ${message.author.username} has to draw 2.`);
                UnoConfig.players[message.author.id].hand.push(Game.getRandomCard());
                UnoConfig.players[message.author.id].hand.push(Game.getRandomCard());
                dmEmbed.setTitle('You Drew 2 Cards!')
                .setDescription(`${UnoConfig.players[UnoConfig.lastPlayer].username} either has more than 1 card or said Uno already!`)
                .setColor('RED');
                channelEmbed.setTitle(`${message.author.username} drew two cards!`)
                .setDescription(`${UnoConfig.players[UnoConfig.lastPlayer].username} either has more than 1 card or has said Uno already!\n
                    Reminder: only say \`.uno\` in here if the last person to play did not say Uno and they only have 1 card left!`)
                .setColor('RED')
                client.users.cache.get(message.author.id).send({embeds:[dmEmbed]});
            }
            client.channels.cache.get(UnoConfig.channelId).send({embeds: [channelEmbed]});

        } else {
            // Saying Uno for yourself
            if (!(UnoConfig.players[message.author.id].playerNumber == UnoConfig.playerOrder[0])) {
                console.log(`${message.author.username} typed .uno when it isn't their turn.`);
                dmEmbed.setTitle('Error!')
                    .setColor('RED')
                    .setDescription(`You can only say Uno when it's your turn!`)
            } else if (UnoConfig.players[message.author.id].hand.length > 2) {
                console.log(`${message.author.username} typed .uno when they have more than 2 cards.`);
                dmEmbed.setTitle('Error!')
                    .setColor('RED')
                    .setDescription(`You have more than 2 cards, you cannot say Uno!`)
            } else {
                UnoConfig.players[UnoConfig.lastPlayer].saidUno = true;
                console.log(`${message.author.username} has said Uno!`);
                dmEmbed.setTitle('Success!')
                    .setColor('GREEN')
                    .setDescription('You have said Uno!');

                
            }
            client.users.cache.get(message.author.id).send({embeds:[dmEmbed]});
        }



    }

});