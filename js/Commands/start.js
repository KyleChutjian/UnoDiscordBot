const Command = require('../Structures/Command.js');
const {Client, MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction} = require('discord.js');
const UnoConfig = require('../Data/uno.json');
const Join = require('../Commands/join.js');
const Game = require('../Structures/Game.js');
const Player = require('../Structures/Player.js');
const Card = require('../Structures/Card.js');

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

            if (!join(message,args,client,ButtonInteraction) && id === 'join') {
                ButtonInteraction.reply({
                    content:'You are already in the game!',
                    ephemeral:true
                });
            } else {
                if (id === 'join') {
                    ButtonInteraction.reply({
                        content: 'You joined the game!',
                        ephemeral: true
                    });
                    embed.setDescription(`${embed.description}
                    ${ButtonInteraction.user.username}`);
                    ButtonInteraction.message.edit({embeds: [embed]});
                    join(message, args, client, ButtonInteraction);
    
                } else if (id === 'start') {
                    ButtonInteraction.reply({
                        content: `${ButtonInteraction.user.username} has started the game!`,
                    })
                    UnoConfig.currentState = "PLAYING";
                    pregame(client);
                    // console.log(UnoConfig.currentState);
                } else if (id === 'stop') {
                    ButtonInteraction.reply({
                        content: `${message.author.username} has stopped the game!`,
                    })
                    UnoConfig.currentState = "WAITING";
                    console.log(UnoConfig.currentState);
                }
            }



            

        })

        collector.on('end', (collection) => {
            UnoConfig.currentState = "PLAYING";
            pregame(client);
            message.channel.send('interaction end');
        })

    }

});

function pregame(client) {
    let players = [];
    switch (UnoConfig.currentState) {
        case "WAITING", "JOINING":
            console.log('cant do that now'); 
            break;
        case "PLAYING":
            let currentCard = 0;
            for (player in UnoConfig.players) {
                currentCard = 0;
                UnoConfig.players[player].hand.forEach(card => {
                    UnoConfig.players[player].hand[currentCard] = getRandomCard();
                    currentCard++;
                })
                
            }

            // console.log(UnoConfig.players);
            // Game.setup();
            Game.turn(client, null);



    }
}

function join(message, args, client, ButtonInteraction) {   
        switch (UnoConfig.currentState) {
            case "JOINING":
                if (UnoConfig.players.hasOwnProperty(ButtonInteraction.user.id)) {
                    return false;
                } else {
                    if (Object.keys(UnoConfig.players).length <= 5) {
                        UnoConfig.playerOrder[UnoConfig.playerCount] = UnoConfig.playerCount + 1;
                        UnoConfig.playerCount++;
                        UnoConfig.players[ButtonInteraction.user.id] = {
                            "username": ButtonInteraction.user.username,
                            "playerNumber": UnoConfig.playerCount,
                            "hand": [null, null, null, null, null, null, null]
                        }
                    }
                    return true;
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

function getRandomCard() {
    const possibleCards = [
        'RED.0', 'RED.1', 'RED.1', 'RED.2', 'RED.2', 'RED.3', 'RED.3', 'RED.4', 'RED.4', 'RED.5', 'RED.5', 'RED.6', 'RED.6', 'RED.7', 'RED.7', 'RED.8', 'RED.8', 'RED.9', 'RED.9',
        'RED.SKIP', 'RED.SKIP', 'RED.PLUSTWO', 'RED.PLUSTWO', 'RED.REVERSE', 'RED.REVERSE',
        'BLUE.0', 'BLUE.1', 'BLUE.1', 'BLUE.2', 'BLUE.2', 'BLUE.3', 'BLUE.3', 'BLUE.4', 'BLUE.4', 'BLUE.5','BLUE.5', 'BLUE.6', 'BLUE.6', 'BLUE.7', 'BLUE.7', 'BLUE.8', 'BLUE.8', 'BLUE.9', 'BLUE.9',
        'BLUE.SKIP', 'BLUE.SKIP', 'BLUE.PLUSTWO', 'BLUE.PLUSTWO', 'BLUE.REVERSE', 'BLUE.REVERSE',
        'YELLOW.0', 'YELLOW.1', 'YELLOW.1', 'YELLOW.2', 'YELLOW.2', 'YELLOW.3', 'YELLOW.3', 'YELLOW.4', 'YELLOW.4', 'YELLOW.5','YELLOW.5', 'YELLOW.6', 'YELLOW.6', 'YELLOW.7', 'YELLOW.7', 'YELLOW.8', 'YELLOW.8', 'YELLOW.9', 'YELLOW.9',
        'YELLOW.SKIP', 'YELLOW.SKIP', 'YELLOW.PLUSTWO', 'YELLOW.PLUSTWO', 'YELLOW.REVERSE', 'YELLOW.REVERSE',
        'GREEN.0', 'GREEN.1', 'GREEN.1', 'GREEN.2', 'GREEN.2', 'GREEN.3', 'GREEN.3', 'GREEN.4', 'GREEN.4', 'GREEN.5','GREEN.5', 'GREEN.6', 'GREEN.6', 'GREEN.7', 'GREEN.7', 'GREEN.8', 'GREEN.8', 'GREEN.9', 'GREEN.9',
        'GREEN.SKIP', 'GREEN.SKIP', 'GREEN.PLUSTWO', 'GREEN.PLUSTWO', 'GREEN.REVERSE', 'GREEN.REVERSE',
        'WILD.WILD', 'WILD.WILD', 'WILD.WILD', 'WILD.WILD', 'WILD.PLUSFOUR', 'WILD.PLUSFOUR', 'WILD.PLUSFOUR', 'WILD.PLUSFOUR', 
    ]
    return possibleCards[Math.floor(Math.random()*possibleCards.length)]
}
/*

playerHands = {
    (player's id): {
        1: "WILD",
        2: "R0",
        3: "YR",
        4: "BS",
        5: "GP",
        6: "PLUSFOUR"
    }
    Full list of options:
    R0-9, RR, RP, RS
    B0-9, BR, BP, BS
    Y0-9, YR, YP, YS
    G0-9, GR, GP, GS
    WILD, PLUSFOUR
}

*/


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