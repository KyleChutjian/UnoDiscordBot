const Card = require('../Structures/Card.js');
const UnoConfig = require('../Data/uno.json');
const Player = require('../Structures/Player.js');
let players = [];

class Game {
    constructor() {
        
    }
    async gameLoop() {
        console.log('game loop function start');
        while(UnoConfig.currentState == "PLAYING") {
            console.log("GAME IS PLAYING");
        }
        return 5;
    }
}




module.exports = Game;