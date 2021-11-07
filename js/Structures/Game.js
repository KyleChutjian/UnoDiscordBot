const Card = require('../Structures/Card.js');
const UnoConfig = require('../Data/uno.json');
const Player = require('../Structures/Player.js');
const { MessageEmbed, MessageActionRow, MessageButton, CommandInteractionOptionResolver } = require('discord.js');
let players = [];

function turn(client, playedCard) {
    if (UnoConfig.currentState != "PLAYING") return;

    if (UnoConfig.currentCard == null) {
        UnoConfig.currentCard = getRandomCard();

        switch (UnoConfig.currentCard.split('.')[1]) {
            case "REVERSE":
                UnoConfig.playerOrder = UnoConfig.playerOrder.reverse();
                break;
            case "PLUSTWO":
                for (player in UnoConfig.players) {
                    if (UnoConfig.players[player].playerNumber == 1) {
                        UnoConfig.players[player].hand.push(getRandomCard());
                        UnoConfig.players[player].hand.push(getRandomCard());
                    }
                }
                break;
            case "SKIP":
                UnoConfig.playerOrder.push(UnoConfig.playerOrder.splice(0, 1)[0]);
                break;
            case "WILD":
                break;
            case "PLUSFOUR":
                break;
        }


        if (UnoConfig.currentCard.split('.')[0] == "WILD") {
            UnoConfig.currentCard = getRandomCard();
        } 
    }
    
    let currentColor = "";
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

    for (player in UnoConfig.players) {
        if (UnoConfig.playerOrder[0] === UnoConfig.players[player].playerNumber) {
            let currentPlayer = UnoConfig.players[player];

            console.log(`\nIt is ${currentPlayer.username}'s turn!`);

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
            });
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('draw')
                    .setLabel('Draw')
                    .setStyle('PRIMARY')
            );
            // sends private message
            client.users.cache.get(player).send({embeds: [embed]});

            // This only happens once, if the first card is a wild
            if (UnoConfig.currentCard == "WILD.WILD") {
                const chooseColorEmbed = new MessageEmbed();
                chooseColorEmbed.setTitle('Choose a Color!')
                    .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
                    .setColor('WHITE')
                    .setDescription(`You played a ${Game.printCard(Game.getCardFromIndex(playedCard,message.author.id))}!\n
                    What color do you want it to be?
                    `);
                const filter = (interaction) => {return true;}
                const chooseColorRow = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId('BLUE')
                        .setLabel('Blue')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('RED')
                        .setLabel('Red')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('GREEN')
                        .setLabel('Green')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('YELLOW')
                        .setLabel('Yellow')
                        .setStyle('SECONDARY'));
                
                message.channel.send({embeds: [chooseColorEmbed], components: [chooseColorRow]});
                let collector = message.channel.createMessageComponentCollector({filter,max:1});
        
                collector.on('collect', async (ButtonInteraction) => {
                    let newColor = ButtonInteraction.customId.toLowerCase();
                    newColor = newColor.charAt(0).toUpperCase() + newColor.slice(1, newColor.length);
                    ButtonInteraction.reply(`You picked ${newColor}`);
                    const id = ButtonInteraction.customId;
                    UnoConfig.currentCard = `${ButtonInteraction.customId}.${playedCardValue}`;
                });
                collector.on('end', (collection) => {
                    const channelEmbed = new MessageEmbed();
                    channelEmbed.setColor('GREEN')
                        .setTitle(`It is Player ${UnoConfig.playerOrder[0]}'s turn!`)
                        .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
                        .setDescription(`${message.author.username} has played a ${Game.printCard(Game.getCardFromIndex(playedCard,message.author.id))}`);
        
        
                    Game.removeCard(playedCard.split('d')[1], message.author.id);
                    Game.getNextPlayer(card);
                    Game.turn(client);
                    return 0; 
                });
            }



            
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
    if (UnoConfig.players[playerId].hand.length == 1) {
        return UnoConfig.players[playerId].hand[card.split('d')[1]-1];
    }
    return UnoConfig.players[playerId].hand[card.split('d')[1]-1];
}

// removes cardNumber (not index) from specified player
function removeCard(cardNumber, playerId) {
    UnoConfig.players[playerId].hand.splice(cardNumber - 1, 1);
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
            imageLink += 'wilddraw4';
            break;
        case "wild":
            imageLink += 'wild';
            break;
        default:
            imageLink += cardValue;
    }
    imageLink += '.png';
    // console.log(imageLink); // used for debugging a broken image
    return imageLink;
}

// "RED.REVERSE" => Reverse playerOrder Array, etc
function getNextPlayer(card) {
    // [1, 2, 3] => [2, 3, 1]
    const playedCardColor = card.split('.')[0];
    const playedCardValue = card.split('.')[1];
    switch (playedCardValue) {
        case "REVERSE":
            // reverse array
            UnoConfig.playerOrder = UnoConfig.playerOrder.reverse();
            break;
        case "PLUSTWO":
            for (player in UnoConfig.players) {
                if (UnoConfig.players[player].playerNumber == UnoConfig.playerOrder[1]) {
                    console.log(`${UnoConfig.players[player].username} has to draw 2.`);
                    UnoConfig.players[player].hand.push(getRandomCard());
                    UnoConfig.players[player].hand.push(getRandomCard());
                }
            }
            UnoConfig.playerOrder.push(UnoConfig.playerOrder.splice(0, 1)[0]);
            UnoConfig.playerOrder.push(UnoConfig.playerOrder.splice(0, 1)[0]);
            break;
        case "PLUSFOUR":
            for (player in UnoConfig.players) {
                if (UnoConfig.players[player].playerNumber == UnoConfig.playerOrder[1]) {
                    console.log(`${UnoConfig.players[player].username} has to draw 4.`);
                    UnoConfig.players[player].hand.push(getRandomCard());
                    UnoConfig.players[player].hand.push(getRandomCard());
                    UnoConfig.players[player].hand.push(getRandomCard());
                    UnoConfig.players[player].hand.push(getRandomCard());
                }
            }
            UnoConfig.playerOrder.push(UnoConfig.playerOrder.splice(0, 1)[0]);
            UnoConfig.playerOrder.push(UnoConfig.playerOrder.splice(0, 1)[0]);
            break;
        case "SKIP":
            // skips over one player in playerOrder
            UnoConfig.playerOrder.push(UnoConfig.playerOrder.splice(0, 1)[0]);
            UnoConfig.playerOrder.push(UnoConfig.playerOrder.splice(0, 1)[0]);
            break;
        default:
            UnoConfig.playerOrder.push(UnoConfig.playerOrder.splice(0, 1)[0]);
    }

}

// resets configs
function resetGame() {
    UnoConfig.players = new Object;
    UnoConfig.playerCount = 0;
    UnoConfig.playerOrder = [];
    UnoConfig.currentCard = null;
    UnoConfig.currentState = "WAITING";
    UnoConfig.direction = true;
    UnoConfig.channelId = null;
    playerList = "";
}

module.exports.getCardImageLink = getCardImageLink;
module.exports.getNextPlayer = getNextPlayer;
module.exports.resetGame = resetGame;
module.exports.getRandomCard = getRandomCard;
module.exports.capitalize = capitalize;
module.exports.removeCard = removeCard;
module.exports.getCardFromIndex = getCardFromIndex;
module.exports.printCard = printCard;
module.exports.turn = turn;

