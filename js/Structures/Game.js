const Card = require('../Structures/Card.js');
const UnoConfig = require('../Data/uno.json');
const Player = require('../Structures/Player.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
let players = [];





function turn(client, playedCard) {
    if (UnoConfig.currentState != "PLAYING") return;
    console.log('-------start of game function----------');

    // establish the first card here
    // UnoConfig.currentCard = "RED.SKIP"; // placeholder
    if (UnoConfig.currentCard == null) {
        UnoConfig.currentCard = getRandomCard();
    }
    
    let currentColor = "";
    console.log(UnoConfig.currentCard);
    switch (UnoConfig.currentCard.split('.')[0]) {
        case "RED":
        case "BLUE":
        case "GREEN":
        case "YELLOW":
            currentColor = UnoConfig.currentCard.split('.')[0];
            break;
        default:
            // console.log(UnoConfig.currentCard.split('.')[0]);
            currentColor = 'WHITE'; // for setColor 
    }

    for (player in UnoConfig.players) {
        if (UnoConfig.playerOrder[0] === UnoConfig.players[player].playerNumber) {
            let currentPlayer = UnoConfig.players[player];
            console.log(`It is ${currentPlayer.username}'s turn!`);

            const embed = new MessageEmbed();
            embed.setTitle(`Player ${currentPlayer.playerNumber}'s turn!`)
                .setAuthor(currentPlayer.username, client.users.cache.get(player).avatarURL({dynamic:true}))
                .setDescription(`Type \`.play card[number]\` to play a card.\n
                Type \`.draw\` to draw a card.`)
                .setImage(getCardImageLink(UnoConfig.currentCard))
                .setColor(currentColor)
                .setFooter('Current Card')
            let cardNumber = 0;
            
            currentPlayer.hand.forEach(card => {
                cardNumber++;
                embed.addField(`card${cardNumber}`,printCard(card),true);
            })
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('draw')
                    .setLabel('Draw')
                    .setStyle('PRIMARY')
            );
            // sends private message
            client.users.cache.get(player).send({embeds: [embed]});
            
            // start making embed that sends in this channel
            const embed2 = new MessageEmbed();
            embed2.setTitle(`It is ${currentPlayer.username}'s turn!`)
                .setDescription(`The current card is a ${printCard(UnoConfig.currentCard)}.`)
                // .setImage('https://raw.githubusercontent.com/Exium1/UnoBot/master/assets/images/defaultCards/red3.png')
                .setImage(getCardImageLink(UnoConfig.currentCard))
                .setColor(currentColor);
            
            client.channels.cache.get(UnoConfig.channelId).send({embeds: [embed2]});
        }
    }
}

// "RED.7" => Red 7, "BLUE.REVERSE" => Blue Reverse
function printCard(card) {
    let returnMsg = "";
    let cardColor = card.split('.')[0]; // "RED"
    let cardValue = card.split('.')[1]; // 7
    cardColor = cardColor.toLowerCase();
    cardColor = cardColor.charAt(0).toUpperCase() + cardColor.slice(1,cardColor.length);
    returnMsg += cardColor;
    switch (cardValue) {
        case "PLUSTWO":
            return returnMsg += " +2";
        case "PLUSFOUR":
            return "+4";
        case "REVERSE":
        case "SKIP":
            cardValue = cardValue.toLowerCase();
            returnMsg += cardValue.charAt(0).toUpperCase() + cardValue.slice(1,cardValue.length);
            return returnMsg;
        case "WILD":
            return "Wild";
        default:
            // the numbers
            returnMsg += " " + cardValue;
            return returnMsg;
    }
}

// "card7" => "RED.7"
function getCardFromIndex(card, playerId) {
    return UnoConfig.players[playerId].hand[card.split('d')[1]-1];
}

// removes cardNumber (not index) from specified player
function removeCard(cardNumber, playerId) {
    UnoConfig.players[playerId].hand.splice(cardNumber - 1, 1);
    // console.log(UnoConfig.players[playerId].hand);
}

// "RED" => "Red"
function capitalize(word) {
    word = word.toLowerCase();
    word = word.charAt(0).toUpperCase() + word.slice(1, word.length);
}

// returns random card in "RED.3" format
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

// "RED.3" => https://raw.githubusercontent.com/Exium1/UnoBot/master/assets/images/defaultCards/red3.png
function getCardImageLink(card) {
    let cardColor = card.split('.')[0].toLowerCase();
    let cardValue = card.split('.')[1].toLowerCase();
    let imageLink = "https://raw.githubusercontent.com/Exium1/UnoBot/master/assets/images/defaultCards/";
    imageLink += cardColor;

    switch (cardValue) {
        case "plustwo":
            imageLink += 'draw2';
            break;
        case "plusfour":
            imageLink += 'draw4';
            break;
        case "wild":
            imageLink += 'wild';
            break;
        default:
            imageLink += cardValue;
    }
    imageLink += '.png';
    // console.log(imageLink);
    return imageLink;
}

function getNextPlayer() {
    // [1, 2, 3] => [2, 3, 1]
    console.log(UnoConfig.playerOrder);
    UnoConfig.playerOrder.push(UnoConfig.playerOrder.splice(0, 1)[0]);
    console.log(UnoConfig.playerOrder);


    // if (UnoConfig.direction) {
    //     UnoConfig.playerOrder[UnoConfig.currentPlayer]

    // }
}

// resets configs
function resetGame() {
    UnoConfig.players = new Object;
    UnoConfig.playerCount = 0;
    UnoConfig.playerOrder = [];
    // UnoConfig.currentPlayer = 1;
    UnoConfig.currentState = "WAITING";
    UnoConfig.direction = true;
    UnoConfig.channelId = null;
    playerList = "";
}

module.exports.getNextPlayer = getNextPlayer;
module.exports.resetGame = resetGame;
module.exports.getRandomCard = getRandomCard;
module.exports.capitalize = capitalize;
module.exports.removeCard = removeCard;
module.exports.getCardFromIndex = getCardFromIndex;
module.exports.printCard = printCard;
module.exports.turn = turn;

