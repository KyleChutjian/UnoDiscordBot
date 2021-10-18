const Card = require('../Structures/Card.js');


class Player {
    /**
     * 
     * @param {string,string} player 
     */
    constructor(player) {
        this.id = player.id;
        this.username = player.username;
        this.hand = generateStartingHand();

    }


}

function generateStartingHand() {
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