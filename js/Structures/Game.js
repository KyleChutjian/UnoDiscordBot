const Card = require('../Structures/Card.js');
const UnoConfig = require('../Data/uno.json');
const Player = require('../Structures/Player.js');
const Draw = require('../Commands/draw.js');
const { MessageEmbed, MessageActionRow, MessageButton, CommandInteractionOptionResolver, MessageCollector, ButtonInteraction } = require('discord.js');
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

            /* Archived code for draw and "say uno" buttons:
             * For future reference: it doesn't work right now because the only way to create a message
             * component collector in a DM channel is to send a message which returns a promise, and then
             * use that promise to access the channel object where you can do createMessageComponentCollector.

             * I can't find a way to access this collector after your turn is over, so when you try to draw
             * after turn 1, it tries to make a second component collector in player1's dm channel, throwing
             * an error. */ 

            // const row = new MessageActionRow().addComponents(
            //     new MessageButton()
            //         .setCustomId('DRAW')
            //         .setLabel('Draw')
            //         .setStyle('PRIMARY')
            // );

            // if (currentPlayer.hand.length == 2) {
            //     console.log(`${currentPlayer.username} Uno.`);
            //     row.addComponents(
            //         new MessageButton()
            //             .setCustomId('UNO')
            //             .setLabel('Uno')
            //             .setStyle('DANGER'));
            // }


            // const filter = (interaction) => {return true;}
            // promise = client.users.cache.get(player).send('t').then(promiseObject => {
            //     client.channels.fetch(promiseObject.channelId).then(channel => {
            //         console.log(channel);
            //         let collector = channel.createMessageComponentCollector({filter, max:2});
            //         collector.on('collect', async (ButtonInteraction) => {
            //             console.log(ButtonInteraction.customId);
            //             switch (ButtonInteraction.customId) {
            //                 case 'DRAW':
            //                     // console.log(ButtonInteraction);
            //                     ButtonInteraction.reply('You chose to draw a card');
            //                     // console.log(row.components[0]);
            //                     // row.components[0].setDisabled(true);
            //                     // row.components[0].disabled = true;
            //                     // console.log(row.components[0]);
            //                     draw(client, channel);
            //                     // Draw.run(null, null, client);
            //                     break;
            //                 case 'UNO':
            //                     ButtonInteraction.reply('You said Uno');
            //                     break;
            //             }
            //         })
            //         console.log(channel);
            //     });
            // })

            // sends private message
            client.users.cache.get(player).send({embeds: [embed]});
            // For when buttons are fixed: 
            // client.users.cache.get(player).send({embeds: [embed], components:[row]});
            // This only happens once, if the first card is a wild
            if (UnoConfig.currentCard == "WILD.WILD") {
                const chooseColorEmbed = new MessageEmbed();
                chooseColorEmbed.setTitle('Choose a Color!')
                    .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
                    .setColor('WHITE')
                    .setDescription(`You played a ${printCard(getCardFromIndex(playedCard,message.author.id))}!\n
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
                        .setDescription(`${message.author.username} has played a ${printCard(getCardFromIndex(playedCard,message.author.id))}`);
        
        
                    removeCard(playedCard.split('d')[1], message.author.id);
                    getNextPlayer(card);
                    turn(client);
                    return 0; 
                });
            }



            
            // start making embed that sends in this channel
            const embed2 = new MessageEmbed();
            embed2.setTitle(`It is ${currentPlayer.username}'s turn!`)
                .setDescription(`The current card is a ${printCard(UnoConfig.currentCard)}.
                ${UnoConfig.players[getLastPlayerId()].username} has ${UnoConfig.players[getLastPlayerId()].hand.length} cards left.`)
                .setImage(getCardImageLink(UnoConfig.currentCard))
                .setColor(currentColor);
            
            if (UnoConfig.players[getLastPlayerId()].hand.length == 2) {
                UnoConfig.players[getLastPlayerId()].saidUno = false;
                console.log(UnoConfig.players[getLastPlayerId()].saidUno);
            }
            

            if (UnoConfig.players[getLastPlayerId()].hand.length == 1) {
                if (UnoConfig.players[getLastPlayerId()].saidUno) {
                    console.log(`${UnoConfig.players[getLastPlayerId()].username} said Uno`);
                    embed2.setDescription(embed2.description + `
                    ${UnoConfig.players[getLastPlayerId()].username} has said Uno!`);
                } else {
                    console.log(`${UnoConfig.players[getLastPlayerId()].username} did not say Uno`);
                    // Add this in?
                    // embed2.setDescription(embed2.description + `
                    // ${UnoConfig.players[getLastPlayerId()].username} has not said Uno!`);
                }


                
            }

            client.channels.cache.get(UnoConfig.channelId).send({embeds: [embed2]});
        }
    }
}

function getCurrentPlayerId() {
    for (player in UnoConfig.players) {
        if (UnoConfig.players[player].playerNumber == UnoConfig.playerOrder[0]) {
            return player;
        }
    }
}

function getLastPlayerId() {
    for (player in UnoConfig.players) {
        if (UnoConfig.players[player].playerNumber == UnoConfig.playerOrder[UnoConfig.playerOrder.length-1]) {
            return player;
        }
    }
}

// "RED.7" => Red 7, "BLUE.REVERSE" => Blue Reverse
function printCard(card) {
    let returnMsg = "";
    let cardColor = card.split('.')[0]; // "RED"
    let cardValue = card.split('.')[1]; // 7
    cardColor = cardColor.toLowerCase(); // "red"
    cardColor = cardColor.charAt(0).toUpperCase() + cardColor.slice(1,cardColor.length); // "Red"
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

// Invalid:-1, Not Wild/+4:1, Wild/+4:0
function isCardPlayable(playedCard, message, client) {
    // INVALID
    if (playedCard == null || playedCard.toLowerCase() == 'card' || !playedCard.toLowerCase().startsWith('card')) {return -1;} else if (playedCard.split('d')[1] > UnoConfig.players[message.author.id].hand.length) {return -1;}
    
    // "card4" => 4 => "RED" and "3"
    cardNumber = playedCard.split('d')[1];
    card = UnoConfig.players[message.author.id].hand[cardNumber-1];
    const playedCardColor = card.split('.')[0];
    const playedCardValue = card.split('.')[1];
    const currentCardColor = UnoConfig.currentCard.split('.')[0];
    const currentCardValue = UnoConfig.currentCard.split('.')[1];
    console.log(`${playedCard}, ${UnoConfig.currentCard}`);
    if (playedCardColor == 'WILD') {
        const chooseColorEmbed = new MessageEmbed();
        chooseColorEmbed.setTitle('Choose a Color!')
            .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
            .setColor('WHITE')
            .setDescription(`You played a ${printCard(getCardFromIndex(playedCard,message.author.id))}!\n
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
                .setStyle('SECONDARY')
        );
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
                .setDescription(`${message.author.username} has played a ${printCard(getCardFromIndex(playedCard,message.author.id))}`);


            removeCard(playedCard.split('d')[1], message.author.id);
            getNextPlayer(card);
            turn(client);
            return 0; 
        });
    } else if (playedCardColor == currentCardColor || playedCardValue == currentCardValue || playedCardColor == 'WILD') {
        console.log(`${message.author.username} played a ${printCard(getCardFromIndex(playedCard,message.author.id))}`);
        getNextPlayer(card);
        return 1;
    } else {
        console.log('not playable');
        return -1;
    }
}

// Returns True/False
function isCardPlayableTF(card) {
    const drawCardColor = card.split('.')[0];
    const drawCardValue = card.split('.')[1];
    const currentCardColor = UnoConfig.currentCard.split('.')[0];
    const currentCardValue = UnoConfig.currentCard.split('.')[1];

    console.log(`${card}, ${UnoConfig.currentCard}`);

    if (drawCardColor == currentCardColor || drawCardValue == currentCardValue || drawCardColor == 'WILD') {
        console.log(`A ${printCard(card)} is playable on a ${printCard(UnoConfig.currentCard)}`);
        return true;
    } else {
        console.log(`A ${printCard(card)} is not playable on a ${printCard(UnoConfig.currentCard)}`);
        return false;
    }
}

// Same as isCardPlayable, but for drawed cards
function isDrawedCardPlayable(playedCard, message, client) {
    // "card4" => 4 => "RED" and "3"
    const playedCardColor = playedCard.split('.')[0];
    const playedCardValue = playedCard.split('.')[1];
    const currentCardColor = UnoConfig.currentCard.split('.')[0];
    const currentCardValue = UnoConfig.currentCard.split('.')[1];
    console.log(`${playedCard}, ${UnoConfig.currentCard}`);
    if (playedCardColor == 'WILD') {
        const chooseColorEmbed = new MessageEmbed();
        chooseColorEmbed.setTitle('Choose a Color!')
            .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
            .setColor('WHITE')
            .setDescription(`You played a ${printCard(playedCard)}!\n
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
                .setStyle('SECONDARY')
        );
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
                .setDescription(`${message.author.username} has played a ${printCard(playedCard)}`);


            removeCard(playedCard.split('d')[1], message.author.id);
            getNextPlayer(playedCard);
            turn(client);
            return 0; 
        });
    } else if (playedCardColor == currentCardColor || playedCardValue == currentCardValue || playedCardColor == 'WILD') {
        console.log(`${message.author.username} played a ${printCard(playedCard)}`);
        getNextPlayer(playedCard);
        return 1;
    } else {
        console.log('draw card not playable');
        return -1;
    }

    /* 
    
    else if (playedCardColor == currentCardColor || playedCardValue == currentCardValue || playedCardColor == 'WILD') {
        console.log(`${message.author.username} played a ${printCard(getCardFromIndex(playedCard,message.author.id))}`);
        getNextPlayer(card);
        return 1;
    } else {
        console.log('not playable');
        return -1;
    }
    
    */
}

// Same as isDrawedCardPlayable, but without message availability
function isButtonDrawPlayable(playedCard, client, player, playerId, channel) {
    // "card4" => 4 => "RED" and "3"
    const playedCardColor = playedCard.split('.')[0];
    const playedCardValue = playedCard.split('.')[1];

    console.log(`${playedCard}, ${UnoConfig.currentCard}`);
    if (playedCardColor == 'WILD') {
        const chooseColorEmbed = new MessageEmbed();
        chooseColorEmbed.setTitle('Choose a Color!')
            .setAuthor(player.username, client.users.cache.get(playerId).avatarURL({dynamic: true}))
            .setColor('WHITE')
            .setDescription(`You played a ${printCard(playedCard)}!\n
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
                .setStyle('SECONDARY')
        );
        channel.send({embeds: [chooseColorEmbed], components: [chooseColorRow]});
        let collector = channel.createMessageComponentCollector({filter,max:1});

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
                .setDescription(`${message.author.username} has played a ${printCard(playedCard)}`);


            removeCard(playedCard.split('d')[1], playerId);
            getNextPlayer(playedCard);
            turn(client);
            return 0; 
        });
    } else {
        // console.log(`${message.author.username} played a ${printCard(playedCard)}`);
        getNextPlayer(playedCard);
        return 1;
    } 
}

// Button version of Draw command with no message availability
function draw(client, channel) {
    let currentPlayerId;
    let currentPlayer;
    for (player in UnoConfig.players) {
        if (UnoConfig.playerOrder[0] === UnoConfig.players[player].playerNumber) {
            currentPlayerId = player;
            currentPlayer = UnoConfig.players[player]
        }
    }

    const embed = new MessageEmbed();
    embed.setTitle('Success!')
        .setAuthor(currentPlayer.username, client.users.cache.get(currentPlayerId).avatarURL({dynamic: true}))
        .setColor('GREEN');

    let card = getRandomCard();
    embed.setDescription(`You drew a ${printCard(card)}`);

    if (isCardPlayableTF(card)) {
        let card = getRandomCard();
        embed.setDescription(`You drew a ${printCard(card)}`);

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
        channel.send({embeds: [embed], components: [drawCardRow]});
        let collector = channel.createMessageComponentCollector({filter, max:1});
        collector.on('collect', async (ButtonInteraction) => {
            if (ButtonInteraction.customId == 'PLAY') {
                const outcome = isButtonDrawPlayable(card, client, currentPlayer, currentPlayerId, channel)
                if (outcome == 1) {
                    embed.setColor('GREEN')
                        .setTitle('Success!')
                        .setDescription(`You played a ${card}`);
        
                    const channelEmbed = new MessageEmbed();
                    channelEmbed.setColor('GREEN')
                        .setTitle(`It is Player ${UnoConfig.playerOrder[0]}'s turn!`)
                        .setAuthor(currentPlayer.username, client.users.cache.get(currentPlayerId).avatarURL({dynamic: true}))
                        .setDescription(`${currentPlayer.username} has played a ${printCard(card)}`);
                    UnoConfig.currentCard = card;
                    getNextPlayer(card)
                    turn(client, card);
                } else {return}
            }
        }) 
        


    } else {
        channel.send({embeds: [embed]});
        UnoConfig.players[currentPlayerId].hand.push(card);
        getNextPlayer('NULL.NULL');
        turn(client, null);
    }
}

// NEEDS FIXING
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

module.exports.getLastPlayerId = getLastPlayerId;
module.exports.getCurrentPlayerId = getCurrentPlayerId;
module.exports.isDrawedCardPlayable = isDrawedCardPlayable;
module.exports.isCardPlayable = isCardPlayable;
module.exports.getCardImageLink = getCardImageLink;
module.exports.getNextPlayer = getNextPlayer;
module.exports.resetGame = resetGame;
module.exports.getRandomCard = getRandomCard;
module.exports.capitalize = capitalize;
module.exports.removeCard = removeCard;
module.exports.getCardFromIndex = getCardFromIndex;
module.exports.printCard = printCard;
module.exports.turn = turn;