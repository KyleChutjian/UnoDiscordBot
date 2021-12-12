const Command = require('../Structures/Command.js');
const {Client, MessageEmbed} = require('discord.js');
const Game = require('../Structures/Game.js');
const UnoConfig = require('../Data/uno.json');

module.exports = new Command({
    name: "hand",
    permission: "SEND_MESSAGES",
    description: "Shows all of user's cards",

    async run(message, args, client) {
        let currentcolor = "";
        switch (UnoConfig.currentCard.split('.')[0]) {
            case "RED":
            case "BLUE":
            case "GREEN":
            case "YELLOW":
                currentColor = UnoConfig.currentCard.split('.')[0];
                break;
            default:
                currentColor = 'WHITE'; // for setColor 
        }
        const embed = new MessageEmbed();
        embed.setTitle(`${message.author.username}'s hand`)
            .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
            .setDescription(`Type \`.play card[number]\` to play a card.\n
            Type \`.draw\` to draw a card.`)
            .setImage(Game.getCardImageLink(UnoConfig.currentCard))
            .setColor(currentColor)
            .setFooter('Current Card')
        
        let cardNumber = 0;
        UnoConfig.players[message.author.id].hand.forEach(card => {
            cardNumber++;
            embed.addField(`card${cardNumber}`, Game.printCard(card),true);
        });
        message.channel.send({embeds: [embed]});
    }

});