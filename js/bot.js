console.clear();

// Instantiating variables
const Client = require('./Structures/Client.js')
const config = require('./Data/config.json');
const client = new Client();

// Start the Bot
client.start(config.token);