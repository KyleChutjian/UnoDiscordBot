const Command = require('../Structures/Command.js');
const {Client, MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction} = require('discord.js');
const UnoConfig = require('../Data/uno.json');
const Join = require('../Commands/join.js');

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
                // Join.run(message, args, client);
                join(message, args, client);

            } else if (id === 'start') {
                ButtonInteraction.reply({
                    content: `${ButtonInteraction.user.username} has started the game!`,
                })
            } else if (id === 'stop') {
                ButtonInteraction.reply({
                    content: `${message.author.username} has stopped the game!`,
                })

            }
            

        })

        collector.on('end', (collection) => {
            collection.forEach((click) => {
                console.log(click.user.username, click.customId);
            })
            if (collection.first()?.customId === 'start') {
                // start the game here
                
            }
            console.log(UnoConfig.players);
            UnoConfig.currentState = "PLAYING";
            message.channel.send('interaction end');
        })

    }

});

function join(message, args, client) {
    // const embed = new MessageEmbed();
    // embed.setTitle('Error!')
    //     .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
    //     .setColor('RED')
    //     .setThumbnail(client.user.avatarURL({dynamic:true}))

    
        switch (UnoConfig.currentState) {
            case "WAITING":
                embed.setDescription('A game has not been started.\nType \`.start\` to start a game.');
                message.channel.send({embeds: [embed]})
                break;

            case "JOINING":
                console.log(Object.keys(UnoConfig.players).length);
                if (Object.keys(UnoConfig.players).length <= 5) {
                    UnoConfig.playerCount++;

                    UnoConfig.players[UnoConfig.playerCount] = [message.author.id, message.author.username];
                    console.log(UnoConfig.players[UnoConfig.playerCount]);
                    // embed.setTitle('Player Joined!');
                    // if (UnoConfig.playerCount == 1) {
                    //     embed.setDescription(`Player ${UnoConfig.playerCount} has joined the game.\n
                    //         There are ${6 - UnoConfig.playerCount} spots left.\n
                    //         1 more player required to begin.`)
                    // } else if (UnoConfig.playerCount == 6) {
                    //     embed.setDescription(`Player ${UnoConfig.playerCount} has joined the game.\n
                    //         There are 0 spots left.
                    //         The game is starting!`);
                    //     Start.run(message, args, client);
                    // } else {
                    //     embed.setDescription(`Player ${UnoConfig.playerCount} has joined the game.\n
                    //         There are ${6 - UnoConfig.playerCount} spots left.\n`)
                    // }

                }
                // message.channel.send({embeds: [embed]})
                break;
            
            case "PLAYING":
                embed.setDescription('There is a game in progress.\nType \`.stop\` to stop the game.');
                message.channel.send({embeds: [embed]})
                break;
        }






}