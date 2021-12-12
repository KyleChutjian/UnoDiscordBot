const Event = require('../Structures/Event.js')
const Discord = require('discord.js')

// Unused
module.exports = new Event('messageReactionAdd', (client, member) => {
    
    console.log("REACTION ADD");
    client.guilds.resolve("✋");

});