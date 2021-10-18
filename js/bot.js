console.clear();

// Instantiating variables
const Client = require('./Structures/Client.js')
const config = require('./Data/config.json');
const Game = require('./Structures/Game.js');
const client = new Client();
const game = new Game();
// Start the Bot
client.start(config.token);

// Game.gameLoop();
// game.gameLoop();