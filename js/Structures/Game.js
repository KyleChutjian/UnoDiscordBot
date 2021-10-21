const Card = require('../Structures/Card.js');
const UnoConfig = require('../Data/uno.json');
const Player = require('../Structures/Player.js');
const { MessageEmbed } = require('discord.js');
let players = [];



function printCard(card) {
    // "RED.7"
    let returnMsg = "";
    let cardColor = card.split('.')[0]; // "RED"
    let cardValue = card.split('.')[1]; // 7
    cardColor = cardColor.toLowerCase();
    cardColor = cardColor.charAt(0).toUpperCase() + cardColor.slice(1,cardColor.length);
    returnMsg += cardColor;

    switch (cardValue) {
        case "PLUSTWO":
            returnMsg += " +2";
            break;
        case "PLUSFOUR":
            return "+4";
        case "REVERSE":
        case "SKIP":
            cardValue = cardValue.toLowerCase();
            returnMsg += cardValue.charAt(0).toUpperCase() + cardValue.slice(1,cardValue.length);



            // returnMsg += " " + cardValue.toLowerCase().charAt(0).toUpperCase();
            break;
        case "WILD":
            return "Wild";
        default:
            returnMsg += " " + cardValue;
    }



    return returnMsg;
}



function turn(client, playedCard) {
    if (UnoConfig.currentState != "PLAYING") return;
    console.log('-------start of game function----------');

    for (player in UnoConfig.players) {
        if (UnoConfig.currentPlayer === UnoConfig.players[player].playerNumber) {
            let currentPlayer = UnoConfig.players[player];
            console.log(`It is ${currentPlayer.username}'s turn!`);
            console.log(currentPlayer.hand);
            const embed = new MessageEmbed();
            embed.setTitle(`Player ${currentPlayer.playerNumber}'s turn!`)
                .setAuthor(currentPlayer.username, client.users.cache.get(player).avatarURL({dynamic:true}))
                .setDescription(`Type \`.play card[number]\` to play a card.`)
                .setColor('RED') // eventually make it current card color
            let cardNumber = 0;
            
            currentPlayer.hand.forEach(card => {
                console.log(card);
                cardNumber++;
                embed.addField(`card${cardNumber}`,printCard(card),true);
            })
            client.users.cache.get(player).send({embeds: [embed]});

        }
    }





    if (players == null) {
        // console.log(playedCard);

        // console.log(UnoConfig.playerHands['230502782623285248'])


        // type in uno channel which card was played, and 
        // if anything special happens ie. reverse/skip/+2/+4/wild 
        return;
    }
// add to json file with all of players 


    if (UnoConfig.currentState != "PLAYING") return;
    // players.forEach(player => {
    //     if (UnoConfig.currentPlayer === player.playerNumber) {
    //         console.log(`It is ${player.username}'s turn!`);
    //         console.log(UnoConfig.playerHands);
    //         const embed = new MessageEmbed();
    //         embed.setTitle(`Player ${player.playerNumber}'s turn!`)
    //             .setAuthor(player.username, client.users.cache.get(player.id).avatarURL({dynamic:true}))
    //             .setDescription(`Type \`.play card[number]\` to play a card.`)
    //             .setColor('RED') // eventually make it current card color
    //         let cardNumber = 0;
    //         player.hand.forEach(card => {
    //             cardNumber++;
    //             embed.addField(`card${cardNumber}`,printCard(card),true);
    //         })

    //         client.users.cache.get(player.id).send({embeds: [embed]});


    //     }
    // })



}

function setup() {
    
}


module.exports.setup = setup;
module.exports.turn = turn;

