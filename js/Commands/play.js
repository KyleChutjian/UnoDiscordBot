const Command = require('../Structures/Command.js');
const {Client, MessageEmbed} = require('discord.js');
const Game = require('../Structures/Game.js');
const UnoConfig = require('../Data/uno.json')

module.exports = new Command({
    name: "play",
    permission: "SEND_MESSAGES",
    description: "Used to play a card",

    async run(message, args, client) {
        const embed = new MessageEmbed();
        embed.setAuthor(message.author.username, message.author.avatarURL({dynamic:true}));
        if (args[1] == null) {
            embed.setColor('RED')
                .setTitle('Invalid!')
                .setDescription(`Please type \`.play card[number]\` to play a card.`);
            message.channel.send({embeds: [embed]});
            return;
        } else {
            embed.setColor('GREEN')
                .setTitle('Success!')
                .setDescription(`You played ${args[1]}`)
        }


        if (args[1] != null && isCardPlayable(args[1],message)) {
            message.channel.send(`played ${args[1]}`);
            card = args[1];
            Game.turn(null, client, card);
        }
        

        
        message.channel.send({embeds: [embed]});
        Game.turn(null, client, args);
    }

});

// checking if card can be played
function isCardPlayable(playedCard, message) {
    // check if card is in player's hands
    cardNumber = playedCard.split('d')[1];
    console.log(`Card Number:${cardNumber}`);
    const currentCardColor = UnoConfig.currentCard.split('.')[0];
    const currentCardValue = UnoConfig.currentCard.split('.')[1];
    card = UnoConfig.playerHands[message.author.id][cardNumber]
    console.log(`curCol:${currentCardColor} vs playCol:${card}`)
    switch (currentCardColor) {
        case 'RED':
        case 'BLUE':
        case 'YELLOW':
        case 'GREEN':
            console.log('r/b/y/g');
            if (currentCardColor[0] == card[0]) return true;
            break;
        case 'W':
        case 'P':
            console.log('w/p');
            return true;
            default:
                console.log('not playable');
                // switch(UnoConfig.)
    }

    return false;
}