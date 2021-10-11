const Card = require('../Structures/Card.js');
const UnoConfig = require('../Data/uno.json');
const Player = require('../Structures/Player.js');

let players = [];

class Game {
    constructor() {
        
    }
    gameLoop() {
        console.log('test');
        while(UnoConfig.currentState == "PLAYING") {
            console.log("GAME IS PLAYING");
        }
        
    }
}


function pregame() {
    switch (UnoConfig.currentState) {
        case "WAITING", "JOINING":
            console.log('cant do that now'); 
            break;

        case "PLAYING":
            playerList = UnoConfig.players;
            playerList.forEach(player => {
                players.push(new Player({
                    "id": player[0],
                    "username": player[1],
                }));
            });

            console.log(players);


    }
}

function gameLoop() {



    while(UnoConfig.currentState == "PLAYING") {
        console.log("GAME IS PLAYING");
    }
}

module.exports = gameLoop();