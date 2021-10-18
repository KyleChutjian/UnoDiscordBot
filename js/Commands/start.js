const Command = require('../Structures/Command.js');
const {Client, MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction} = require('discord.js');
const UnoConfig = require('../Data/uno.json');
const Join = require('../Commands/join.js');
const Game = require('../Structures/Game.js');
const Player = require('../Structures/Player.js');

module.exports = new Command({
    name: "start",
    permission: "SEND_MESSAGES",
    description: "Starts Uno",

    async run(message, args, client) {
        let playerList = "";

        const embed = new MessageEmbed();
        embed.setColor('RED')
            .setThumbnail(client.user.avatarURL({dynamic:true}))
            .setTitle('A New Game is Starting!')
            .setDescription(`- 2-6 players can join this game.\n
                - Type \`.join\` to manually join the game.\n
                - Type \`.start\` to manually start the game.\n
                - The game will automatically start if there are 6 players.\n
                \*\*Current Players:\*\*`);
                UnoConfig.currentState = "JOINING";



        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('join')
                .setLabel('Join')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('start')
                .setLabel('Start')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('stop')
                .setLabel('Stop')
                .setStyle('DANGER'),
            
        );
        
        message.channel.send({embeds: [embed], components: [row]});
        
        const filter = (interaction) => {
            if (interaction.customId == 'stop') {
                interaction.disabled = true;
            }
            return true;
        }

        const collector = message.channel.createMessageComponentCollector({filter, max: 6}); //  

        collector.on('collect', async (ButtonInteraction) => {
            const id = ButtonInteraction.customId;
            if (id === 'join') {
                ButtonInteraction.reply({
                    content: 'You joined the game!',
                    ephemeral: true
                })
                embed.setDescription(`${embed.description}
                ${ButtonInteraction.user.username}`);
                ButtonInteraction.message.edit({embeds: [embed]});
                join(message, args, client);

            } else if (id === 'start') {
                ButtonInteraction.reply({
                    content: `${ButtonInteraction.user.username} has started the game!`,
                })
                UnoConfig.currentState = "PLAYING";
                pregame();
                console.log(UnoConfig.currentState);
            } else if (id === 'stop') {
                ButtonInteraction.reply({
                    content: `${message.author.username} has stopped the game!`,
                })
                UnoConfig.currentState = "WAITING";
                console.log(UnoConfig.currentState);
            }
            

        })

        collector.on('end', (collection) => {
            // console.log(UnoConfig.players);
            UnoConfig.currentState = "PLAYING";
            pregame();
            message.channel.send('interaction end');
        })

    }

});

function pregame() {
    let players = [];
    let currentPlayer = {};
    switch (UnoConfig.currentState) {
        case "WAITING", "JOINING":
            console.log('cant do that now'); 
            break;

        case "PLAYING":
            for (player in UnoConfig.players) {
                // console.log(player);
                players.push(new Player({
                    "id": UnoConfig.players[player][0],
                    "username": UnoConfig.players[player][1],
                }))
            }

            console.log(players);
            // Game.gameLoop();


    }
}

function join(message, args, client) {    
        switch (UnoConfig.currentState) {
            case "JOINING":
                if (Object.keys(UnoConfig.players).length <= 5) {
                    UnoConfig.playerCount++;
                    UnoConfig.players[UnoConfig.playerCount] = [message.author.id, message.author.username];
                    // console.log("join:" + JSON.stringify(UnoConfig.players));
                }
                break;
            case "WAITING":
                embed.setDescription('A game has not been started.\nType \`.start\` to start a game.');
                message.channel.send({embeds: [embed]})
                break;
            case "PLAYING":
                embed.setDescription('There is a game in progress.\nType \`.stop\` to stop the game.');
                message.channel.send({embeds: [embed]})
                break;
        }






}

/*

[P1, P2, P3, P4, P5, P6]
[P2, P3, P4, P5, P6, P1]
[P3, P4, P5, P6, P1, P2]
[P4, P5, P6, P1, P2, P3]
[P6, P1, P2, P3, P4, P5] // P4 plays skip
[P5, P4, P3, P2, P1, P6] // P6 plays reverse
[P4, P3, P2, P1, P6, P5]
[P3, P2, P1, P6, P5, P4]
[P4, P5, P6, P1, P2, P3] // P3 plays reverse

*/