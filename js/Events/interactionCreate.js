const Event = require('../Structures/Event.js')
const Discord = require('discord.js')

module.exports = new Event('interactionCreate', (client, interaction) => {
    if (interaction.isButton()) {
        // // console.log(interaction);

        // if (interaction.customId === 'join') {
        //     interaction.reply({content: `${interaction.user.tag} clicked Join button`});
        // }


        // interaction.reply({ content: `${interaction.user.tag} clicked me!`})
    }
});