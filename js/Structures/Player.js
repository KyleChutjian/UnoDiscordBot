const Card = require('../Structures/Card.js');

class Player {
    constructor(player) {
        this.id = player.id;
        this.username = player.username;
        this.hand = generateStartingHand();

    }


}

function generateStartingHand() {
    
}

function draw(numberOfCards, card) {
    // card == card already played
}

function play(cardPlayed, newCard) {
    // cardPlayed == card already played
    // newCard == card player trying to play
    
}