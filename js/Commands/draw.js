const Command = require('../Structures/Command.js');
const {Client, MessageEmbed} = require('discord.js');
const UnoConfig = require('../Data/uno.json');

module.exports = new Command({
    name: "draw",
    permission: "SEND_MESSAGES",
    description: "Draws a card from the top of the deck",

    async run(message, args, client) {
        const embed = new MessageEmbed();

        switch (UnoConfig.currentState) {
            case "WAITING":
            case "JOINING":
                // send embedded message saying a game has not been started.
                return;
            case "PLAYING":
                if (!UnoConfig.players[message.author.id].playerNumber == UnoConfig.playerOrder[0]) {
                    // send an embedded message saying it is not your turn
                }
        }


        embed.setTitle(`Success!`)
        .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
        .setColor('GREEN')

        // let card = getRandomCard(); 
        let card = "WILD.WILD";
        
        embed.setDescription(`You drew a ${printCard(card)}`);
        message.channel.send({embeds: [embed]});
        UnoConfig.players[message.author.id].hand.push(card);
        console.log(UnoConfig.players[message.author.id]);
    }

    
});
// RED.3 format:
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
    return possibleCards[Math.floor(Math.random()*possibleCards.length)]
}