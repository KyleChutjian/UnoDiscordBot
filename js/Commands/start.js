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
        UnoConfig.channelId = message.channel.id;
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
            return true;
        }
        let collector = message.channel.createMessageComponentCollector({filter, max: 6});
        
        collector.on('collect', async (ButtonInteraction) => {
            const id = ButtonInteraction.customId;
            if (UnoConfig.players.hasOwnProperty(ButtonInteraction.user.id) && id === 'join') {
                ButtonInteraction.reply({
                    content:'You are already in the game!',
                    ephemeral:true
                });
            } else {
                switch (id) {
                    case 'join':
                        ButtonInteraction.reply({
                            content: 'You joined the game!',
                            ephemeral: true
                        });
                        embed.setDescription(`${embed.description}
                        ${ButtonInteraction.user.username}`);
                        ButtonInteraction.message.edit({embeds: [embed]});
                        join(message, args, client, ButtonInteraction);
                        console.log(`${message.author.username} has successfully joined the game.`)
                        break;
                    case 'start':
                        ButtonInteraction.reply({
                            content: `${ButtonInteraction.user.username} has started the game!`,
                        });
                        UnoConfig.currentState = "PLAYING";
                        pregame(client, message);
                        break;
                    case 'stop':
                        ButtonInteraction.reply({
                            content: `${message.author.username} has stopped the game!`,
                        });
                        UnoConfig.currentState = "WAITING";
                        Game.resetGame();
                        break;
                    default:
                        console.log('Something went wrong');
                }
            }
        })
        collector.on('end', (collection) => {
            UnoConfig.currentState = "PLAYING";
            pregame(client, message);
            message.channel.send('interaction end');
            collector.stop();
        })

    }

});

function pregame(client, message) {
    let players = [];
    switch (UnoConfig.currentState) {
        case "WAITING", "JOINING":
            console.log('cant do that now'); 
            break;
        case "PLAYING":
            UnoConfig.currentCard = Game.getRandomCard();

            switch (UnoConfig.currentCard.split('.')[1]) {
                case "REVERSE":
                    UnoConfig.playerOrder = UnoConfig.playerOrder.reverse();
                    break;
                case "PLUSTWO":
                    for (player in UnoConfig.players) {
                        if (UnoConfig.players[player].playerNumber == 1) {
                            UnoConfig.players[player].hand.push(Game.getRandomCard());
                            UnoConfig.players[player].hand.push(Game.getRandomCard());
                        }
                    }
                    break;
                case "SKIP":
                    UnoConfig.playerOrder.push(UnoConfig.playerOrder.splice(0, 1)[0]);
                    break;
                case "WILD":
                    break;
                case "PLUSFOUR":
                    break;
            }
    
    
            if (UnoConfig.currentCard.split('.')[0] == "WILD") {
                UnoConfig.currentCard = Game.getRandomCard();
            } 



            let currentCard = 0;
            for (player in UnoConfig.players) {
                currentCard = 0;
                UnoConfig.players[player].hand.forEach(card => {
                    UnoConfig.players[player].hand[currentCard] = Game.getRandomCard();
                    currentCard++;
                });
                if (UnoConfig.playerOrder[0] != UnoConfig.players[player].playerNumber) {
                    // client.users.cache.get(player).send('test');
                    const initialEmbed = new MessageEmbed();
                    initialEmbed.setTitle('')
                    let currentcolor = "";
                    switch (UnoConfig.currentCard.split('.')[0]) {
                        case "RED":
                        case "BLUE":
                        case "GREEN":
                        case "YELLOW":
                            currentColor = UnoConfig.currentCard.split('.')[0];
                            break;
                        default:
                            currentColor = 'WHITE'; // for setColor 
                    }
                    initialEmbed.setTitle(`${UnoConfig.players[player].username}'s hand`)
                        .setAuthor(UnoConfig.players[player].username, client.users.cache.get(player).avatarURL({dynamic:true}))
                        .setDescription(`Type \`.play card[number]\` to play a card.\n
                        Type \`.draw\` to draw a card.`)
                        .setImage(Game.getCardImageLink(UnoConfig.currentCard))
                        .setColor(currentColor)
                        .setFooter('Current Card')
                    
                    let cardNumber = 0;
                    UnoConfig.players[player].hand.forEach(card => {
                        cardNumber++;
                        initialEmbed.addField(`card${cardNumber}`, Game.printCard(card),true);
                    });
                    client.users.cache.get(player).send({embeds: [initialEmbed]});


                }
                
            }
            Game.turn(client, null);
            break;
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
                            "hand": [null, null, null, null, null, null, null],
                            // "hand": [null, null, null], // for testing win condition
                            "saidUno": false
                        }
                    }
                    return true;
                }

            case "WAITING":
                embed.setDescription('A game has not been started.\nType \`.start\` to start a game.');
                message.channel.send({embeds: [embed]})
                break;
            case "PLAYING":
                const stopEmbed = new MessageEmbed();
                stopEmbed.setTitle('Invalid!')
                    .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
                    .setDescription('There is a game in progress.\nType \`.stop\` to stop the game.');
                message.channel.send({embeds: [stopEmbed]})
                break;
        }
}