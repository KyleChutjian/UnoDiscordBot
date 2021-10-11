const Event = require('../Structures/Event.js')
const Discord = require('discord.js')


module.exports = new Event('messageReactionAdd', (client, member) => {
    
    console.log("REACTION ADD");

    client.guilds.resolve("✋");
    // console.log(member.reactions);
    // client.
    

});

        // message.channel.send({embeds: [embed]}).then(embedMessage => {
        //     embedMessage.react('✋')
        //     embedMessage.react('✅')
        //     embedMessage.react('❌');
        // });
