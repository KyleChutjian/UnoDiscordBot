const Command = require('../Structures/Command.js');
const {Client, MessageEmbed} = require('discord.js');
const Game = require('../Structures/Game.js');

module.exports = new Command({
    name: "play",
    permission: "SEND_MESSAGES",
    description: "Used to play a card",

    async run(message, args, client) {
        const embed = new MessageEmbed();
        embed.setAuthor(message.author.username, message.author.avatarURL({dynamic:true}));
        if (args[1] == null) {
            embed.setColor('RED')
                .setTitle('Invalid!')
                .setDescription(`Please type \`.play card[number]\` to play a card.`);
            message.channel.send({embeds: [embed]});
            return;
        } else {
            embed.setColor('GREEN')
                .setTitle('Success!')
                .setDescription(`You played ${args[1]}`)
        }


        if (args[1] != null) {
            message.channel.send(`played ${args[1]}`);
            card = args[1];
            Game.turn(null, client, card);
        }
        
        message.channel.send({embeds: [embed]});
        Game.turn(null, client, args);
    }

});