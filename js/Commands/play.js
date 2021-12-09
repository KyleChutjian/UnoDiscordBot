const Command = require('../Structures/Command.js');
const {Client, MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction} = require('discord.js');
const Game = require('../Structures/Game.js');
const UnoConfig = require('../Data/uno.json');

module.exports = new Command({
    name: "play",
    permission: "SEND_MESSAGES",
    description: "Used to play a card",

    async run(message, args, client) {
        const embed = new MessageEmbed();
        const denyEmbed = new MessageEmbed();
        embed.setAuthor(message.author.username, message.author.avatarURL({dynamic:true}));
        denyEmbed.setTitle('Invalid!')
            .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
            .setColor('RED');
        switch (UnoConfig.currentState) {
            case "WAITING":
            case "JOINING":
                denyEmbed.setDescription('There is no ongoing game yet!');
                message.channel.send({embeds:[denyEmbed]});
                return;
            case "PLAYING":
                if (!(UnoConfig.players[message.author.id].playerNumber == UnoConfig.playerOrder[0])) {
                    const denyEmbed = new MessageEmbed();
                    denyEmbed.setDescription(`You cannot draw a card when it is not your turn!`);
                    message.channel.send({embeds: [denyEmbed]});
                    return;
                }
                UnoConfig.lastPlayer = message.author.id;
                // Not current player's turn
                if (!UnoConfig.players[message.author.id].playerNumber == UnoConfig.playerOrder[0]) {
                    embed.setColor('RED')
                        .setTitle('Invalid!')
                        .setDescription(`It is Player ${UnoConfig.playerOrder[0]}'s turn!'`);
                    return;
                }
                const outcome = Game.isCardPlayable(args[1],message, client)
                if (outcome == 1 && UnoConfig.players[message.author.id].hand.length == 1) {
                    console.log(`${UnoConfig.players[message.author.id].username} wins`);
                    embed.setColor('GREEN')
                        .setTitle(`You Win!`)
                        .setDescription(`Congratulations, you have won the game!`)
                        .setImage('https://www.nicepng.com/png/detail/13-139694_congratulation-png-congratulations-clip-art.png');

                    const channelEmbed = new MessageEmbed();
                    channelEmbed.setColor('GREEN')
                        .setTitle(`${message.author.username} has won the game!`)
                        .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
                        .setDescription(`He played a ${Game.printCard(Game.getCardFromIndex(args[1],message.author.id))} to win the game.`)
                        .setImage('https://www.nicepng.com/png/detail/13-139694_congratulation-png-congratulations-clip-art.png');

                    UnoConfig.currentState = "WAITING";
                    message.channel.send({embeds:[embed]});
                    client.channels.fetch(UnoConfig.channelId).then(channel => {
                        channel.send({embeds:[channelEmbed]});
                    });
                    Game.resetGame();
                    console.log('reset game is run (not fully implemented)');
                    return;
                } else if (outcome == 1 && UnoConfig.players[message.author.id].hand.length == 2) {
                    console.log(`${UnoConfig.players[message.author.id].username} has uno, but has not said it yet`);

                }
                
                // NOT wild/+4
                if (outcome == 1 && UnoConfig.players[message.author.id].hand.length > 1) {
                    card = Game.printCard(Game.getCardFromIndex(args[1],message.author.id));
                    embed.setColor('GREEN')
                        .setTitle('Success!')
                        .setDescription(`You played a ${card}`);

                    const channelEmbed = new MessageEmbed();
                    channelEmbed.setColor('GREEN')
                        .setTitle(`It is Player ${UnoConfig.playerOrder[0]}'s turn!`)
                        .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
                        .setDescription(`${message.author.username} has played a ${Game.printCard(Game.getCardFromIndex(args[1],message.author.id))}`);
                    UnoConfig.currentCard = Game.getCardFromIndex(args[1], message.author.id);
                    Game.removeCard(args[1].split('d')[1], message.author.id);
                    Game.turn(client);
                // INVALID 
                } else if (outcome == -1) {
                    embed.setColor('RED')
                        .setTitle('Invalid!')
                        .setDescription(`Please type \`.play card[number]\` to play a card.`);
                } else {return}
                message.channel.send({embeds: [embed]});
            }
        }


        
});