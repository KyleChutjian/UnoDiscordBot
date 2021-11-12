const Command = require('../Structures/Command.js');
const {Client, MessageEmbed, MessageActionRow, ButtonInteraction, MessageButton} = require('discord.js');
const UnoConfig = require('../Data/uno.json');
const Game = require('../Structures/Game.js');

module.exports = new Command({
    name: "draw",
    permission: "SEND_MESSAGES",
    description: "Draws a card from the top of the deck",

    run(message, args, client) {
        // let channel;
        // if (message == null) {
        //     for (player in UnoConfig.players) {
        //         if (UnoConfig.playerOrder[0] === UnoConfig.players[player].playerNumber) {
        //             promise = client.users.cache.get(player).send('t').then(promiseObject => {
        //                 channel = promise.channel;
        //                 console.log(channel);
        //             })
        //         }
        //     }
            
        // } else {
        //     channel = message.channel;
        // }


        const embed = new MessageEmbed();
        embed.setTitle(`Success!`)
            .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
            .setColor('GREEN');



        const denyEmbed = new MessageEmbed();
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
                } else {
                    let card = getRandomCard();
                    embed.setDescription(`You drew a ${printCard(card)}`);

                    if (isCardPlayable(card)) {
                        const filter = (interaction) => {return true;}
                        const drawCardRow = new MessageActionRow().addComponents(
                            new MessageButton()
                                .setCustomId('PLAY')
                                .setLabel('Play')
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('KEEP')
                                .setLabel('Keep')
                                .setStyle('SECONDARY'));

                        embed.setDescription(embed.description + `\nPlay the ${printCard(card)}?`);
                        message.channel.send({embeds: [embed], components: [drawCardRow]});

                        let collector = message.channel.createMessageComponentCollector({filter,max:1});
                    
                        collector.on('collect', async (ButtonInteraction) => {
                            if (ButtonInteraction.customId == 'PLAY') {
                                const outcome = Game.isDrawedCardPlayable(card, message, client);
                                if (outcome == 1) {
                                    console.log(1);
                                    embed.setColor('GREEN')
                                        .setTitle('Success!')
                                        .setDescription(`You played a ${card}`);
                        
                                    const channelEmbed = new MessageEmbed();
                                    channelEmbed.setColor('GREEN')
                                        .setTitle(`It is Player ${UnoConfig.playerOrder[0]}'s turn!`)
                                        .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
                                        .setDescription(`${message.author.username} has played a ${Game.printCard(card)}`);
                                    UnoConfig.currentCard = card;
                                    Game.getNextPlayer(card)
                                    Game.turn(client, card);
                                } else {return}





                                UnoConfig.currentCard = card;
                                Game.getNextPlayer(card);
                                Game.turn(client, card);
                                ButtonInteraction.reply(`You played the ${printCard(card)}!`)

                            } else if (ButtonInteraction.customId == 'KEEP') {
                                ButtonInteraction.reply(`You kept the ${printCard(card)}.`)
                                Game.getNextPlayer("NULL.NULL");
                                UnoConfig.players[message.author.id].hand.push(card);
                                Game.turn(client, null);
                            }
                        })
                    } else {
                        message.channel.send({embeds: [embed]});
                        UnoConfig.players[message.author.id].hand.push(card);
                        Game.getNextPlayer("NULL.NULL");
                        Game.turn(client, null);
                    }


                    
                }
        }



    }

    
});

function isCardPlayable(card) {

    const drawCardColor = card.split('.')[0];
    const drawCardValue = card.split('.')[1];
    const currentCardColor = UnoConfig.currentCard.split('.')[0];
    const currentCardValue = UnoConfig.currentCard.split('.')[1];

    if (drawCardColor == currentCardColor || drawCardValue == currentCardValue || drawCardColor == 'WILD') {
        console.log(`A ${printCard(card)} is playable on a ${printCard(UnoConfig.currentCard)}`);
        return true;
    } else {
        console.log(`A ${printCard(card)} is not playable on a ${printCard(UnoConfig.currentCard)}`);
        return false;
    }

}
    /*
        else if (playedCardColor == currentCardColor || playedCardValue == currentCardValue || playedCardColor == 'WILD') {
        console.log(`${message.author.username} played a ${Game.printCard(Game.getCardFromIndex(playedCard,message.author.id))}`);
        Game.getNextPlayer(card);
        return 1;
    } 


    */


// RED.3 => Red 3
function printCard(card) {
    let cardColor = card.split('.')[0];
    let cardValue = card.split('.')[1];
    switch(cardColor) {
        case "RED":
        case "BLUE":
        case "GREEN":
        case "YELLOW":
            cardColor = cardColor.toLowerCase();
            cardColor = cardColor.charAt(0).toUpperCase() + cardColor.slice(1,cardColor.length);
            break;
        case "WILD":
            if (cardValue == "WILD") return "Wild";
            if (cardValue == "PLUSFOUR") return "+4";
            break;
        default:
            console.log('Something went wrong, attempted to draw invalid card.');
    }
    switch (cardValue) {
        case "REVERSE":
        case "SKIP":
            cardValue = cardValue.toLowerCase();
            cardValue = cardValue.charAt(0).toUpperCase() + cardValue.slice(1,cardValue.length);
            return `${cardColor} ${cardValue}`;
        case "PLUSTWO":
            return `${cardColor} +2`
        default:
            return `${cardColor} ${cardValue}`;
    }
}
function getRandomCard() {
    const possibleCards = [
        'RED.0', 'RED.1', 'RED.1', 'RED.2', 'RED.2', 'RED.3', 'RED.3', 'RED.4', 'RED.4', 'RED.5', 'RED.5', 'RED.6', 'RED.6', 'RED.7', 'RED.7', 'RED.8', 'RED.8', 'RED.9', 'RED.9',
        'RED.SKIP', 'RED.SKIP', 'RED.PLUSTWO', 'RED.PLUSTWO', 'RED.REVERSE', 'RED.REVERSE',
        'BLUE.0', 'BLUE.1', 'BLUE.1', 'BLUE.2', 'BLUE.2', 'BLUE.3', 'BLUE.3', 'BLUE.4', 'BLUE.4', 'BLUE.5','BLUE.5', 'BLUE.6', 'BLUE.6', 'BLUE.7', 'BLUE.7', 'BLUE.8', 'BLUE.8', 'BLUE.9', 'BLUE.9',
        'BLUE.SKIP', 'BLUE.SKIP', 'BLUE.PLUSTWO', 'BLUE.PLUSTWO', 'BLUE.REVERSE', 'BLUE.REVERSE',
        'YELLOW.0', 'YELLOW.1', 'YELLOW.1', 'YELLOW.2', 'YELLOW.2', 'YELLOW.3', 'YELLOW.3', 'YELLOW.4', 'YELLOW.4', 'YELLOW.5','YELLOW.5', 'YELLOW.6', 'YELLOW.6', 'YELLOW.7', 'YELLOW.7', 'YELLOW.8', 'YELLOW.8', 'YELLOW.9', 'YELLOW.9',
        'YELLOW.SKIP', 'YELLOW.SKIP', 'YELLOW.PLUSTWO', 'YELLOW.PLUSTWO', 'YELLOW.REVERSE', 'YELLOW.REVERSE',
        'GREEN.0', 'GREEN.1', 'GREEN.1', 'GREEN.2', 'GREEN.2', 'GREEN.3', 'GREEN.3', 'GREEN.4', 'GREEN.4', 'GREEN.5','GREEN.5', 'GREEN.6', 'GREEN.6', 'GREEN.7', 'GREEN.7', 'GREEN.8', 'GREEN.8', 'GREEN.9', 'GREEN.9',
        'GREEN.SKIP', 'GREEN.SKIP', 'GREEN.PLUSTWO', 'GREEN.PLUSTWO', 'GREEN.REVERSE', 'GREEN.REVERSE',
        'WILD.WILD', 'WILD.WILD', 'WILD.WILD', 'WILD.WILD', 'WILD.PLUSFOUR', 'WILD.PLUSFOUR', 'WILD.PLUSFOUR', 'WILD.PLUSFOUR', 
    ]
    // return "WILD.PLUSFOUR"; // For manually set draw card for testing purposes 
    return possibleCards[Math.floor(Math.random()*possibleCards.length)]
}