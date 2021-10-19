const Card = require('../Structures/Card.js');
const UnoConfig = require('../Data/uno.json');
const Player = require('../Structures/Player.js');
const { MessageEmbed } = require('discord.js');
// const Client = require('./Client.js');
// const client = new Client();
let players = [];

function printCard(card) {
    switch (card.value) {
        case "WILD":
            return 'Wild'
        case "PLUSFOUR":
            return '+4'
        case "SKIP":
            return `${card.color[0]} Skip`
        case "PLUSTWO":
            return `${card.color[0]} +2`
        case "REVERSE":
            return `${card.color[0]} Reverse`
        default:
            return `${card.color[0]} ${card.value}`
        
    }
    return `${card.color[0]}:${card.value}`
}

function turn(players, client, playedCard) {
    if (players == null) {
        console.log(playedCard);
        // type in uno channel which card was played, and 
        // if anything special happens ie. reverse/skip/+2/+4/wild 
        return;
    }
// add to json file with all of players 


    if (UnoConfig.currentState != "PLAYING") return;
    console.log('-------start of game function----------');
    players.forEach(player => {
        if (UnoConfig.currentPlayer === player.playerNumber) {
            console.log(`It is ${player.username}'s turn!`);
            console.log(UnoConfig.playerHands);
            const embed = new MessageEmbed();
            embed.setTitle(`Player ${player.playerNumber}'s turn!`)
                .setAuthor(player.username, client.users.cache.get(player.id).avatarURL({dynamic:true}))
                .setDescription(`Type \`.play card[number]\` to play a card.`)
                .setColor('RED') // eventually make it current card color
            let cardNumber = 0;
            player.hand.forEach(card => {
                cardNumber++;
                embed.addField(`card${cardNumber}`,printCard(card),true);
            })

            // uncomment to actually send the direct message
            client.users.cache.get(player.id).send({embeds: [embed]});


        }
    })



}





module.exports.turn = turn;
