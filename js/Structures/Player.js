const Card = require('../Structures/Card.js');
const UnoConfig = require('../Data/uno.json');
const playerHands = UnoConfig.playerHands;
let id = 0;
class Player {
    /**
     * 
     * @param {string,string,int} player 
     */
    constructor(player) {
        this.id = player.id;
        this.username = player.username;
        this.playerNumber = player.playerNumber;
        this.hand = generateStartingHand(this.id);
        
    }


}

function getJSONCardString(colorInt, valueInt) {
    let colorString = "";
    switch (colorInt) {
        case 0:
            colorString = "R";
            break;
        case 1:
            colorString = "B";
            break;
        case 2:
            colorString = "Y";
            break;
        case 3:
            colorString = "G";
            break;
    }
    switch (valueInt) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            return `${colorString}${valueInt}`;
        case 10:
            return `${colorString}R`;
        case 11:
            return `${colorString}S`;
        case 12:
            return `${colorString}P`;
        case 13:
            return "WILD";
        case 14:
            return "PLUSFOUR";
    }

}

function generateStartingHand(playerId) {
    let hand = [null, null, null, null, null, null, null];
    let color = 0;
    let value = 0;
    let cardNumber = 0;

    playerHands[playerId] = [];


    hand.forEach(card => {
        cardNumber++;
        color = Math.floor(Math.random()*4);
        value = Math.floor(Math.random()*15);
        playerHands[playerId].push(getJSONCardString(color, value));
    });
    UnoConfig.playerHands = playerHands;


    return [
        new Card(Math.floor(Math.random() * 4),Math.floor(Math.random() * 15)),
        new Card(Math.floor(Math.random() * 4),Math.floor(Math.random() * 15)),
        new Card(Math.floor(Math.random() * 4),Math.floor(Math.random() * 15)),
        new Card(Math.floor(Math.random() * 4),Math.floor(Math.random() * 15)),
        new Card(Math.floor(Math.random() * 4),Math.floor(Math.random() * 15)),
        new Card(Math.floor(Math.random() * 4),Math.floor(Math.random() * 15)),
        new Card(Math.floor(Math.random() * 4),Math.floor(Math.random() * 15)),
    ]
}

function draw(numberOfCards, card) {
    // card == card already played
}

function play(cardPlayed, newCard) {
    // cardPlayed == card already played
    // newCard == card player trying to play
    
}

module.exports = Player;