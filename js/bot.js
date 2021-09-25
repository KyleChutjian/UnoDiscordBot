// Instantiating variables
console.clear();
const Discord = require('discord.js');
const config = require('./Data/config.json');
const intents = new Discord.Intents(32767);
const client = new Discord.Client({ intents });

// If bot is ready, print message
client.on('ready', () => {
    console.log(client.user.tag + " is online!")
});

client.on('messageCreate', message => {
    if (message.content.startsWith(config.prefix)) {
        console.log(message.content.substring(1,message.content.length))
    }


    

});


// Login using token
client.login(config.token)