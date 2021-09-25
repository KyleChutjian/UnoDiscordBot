
// client.commands = new Discord.Collection();

console.clear();
// Instantiating variables
const Client = require('./Structures/Client.js')
const Command = require('./Structures/Command.js')
const config = require('./Data/config.json');
const client = new Client();
const fs = require('fs') // fs = file system

fs.readdirSync('./js/Commands').filter(file => file.endsWith('.js')).forEach(file => {
    /**
     * @type {Command}
     */
    const command = require(`./Commands/${file}`); // backtick is for objects
    console.log(`Command ${command.name} loaded.`)
    client.commands.set(command.name, command);
});

// If bot is ready, print message
client.on('ready', () => {
    console.log(client.user.tag + " is online!")
});

client.on('messageCreate', message => {
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.substring(config.prefix.length).split(/ +/)

    const command = client.commands.find(cmd => cmd.name == args[0]);

    if (!command) return message.reply(`${args[0]} is not a valid command!`)

    command.run(message, args, client);


});

// Login using token
client.login(config.token)