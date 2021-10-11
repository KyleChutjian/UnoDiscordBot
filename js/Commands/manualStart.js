const Command = require('../Structures/Command.js');
const {Client, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const UnoConfig = require('../Data/uno.json');

module.exports = new Command({
    name: "manualStart",
    permission: "SEND_MESSAGES",
    description: "Starts Uno",

    async run(message, args, client) {
        let playerList = "";

        const embed = new MessageEmbed();;
        embed.setColor('RED')
            .setThumbnail(client.user.avatarURL({dynamic:true}))
        
        switch (UnoConfig.currentState) {
            case "WAITING":
                embed.setTitle('A New Game is Starting!')
                    .setDescription(`- 2-6 players can join this game.\n
                    - Type \`.join\` to join the game.\n
                    - Type \`.start\` to manually start the game.\n
                    - The game will automatically start if there are 6 players.`);
                UnoConfig.currentState = "JOINING";


                // message.react('✋');
                break;
            case "JOINING":
                if (UnoConfig.playerCount == 0 || UnoConfig.playerCount == 1) {
                    embed.setTitle('Error!')
                        .setDescription(`Need more players in order to start a game.`);
                    break;
                } 
                for (player in UnoConfig.players) {
                    if (UnoConfig.players[player][1] != null) {
                        playerList += player[0] + ". " + UnoConfig.players[player][1] + "\n";
                    }
                }
                embed.setTitle('Game Start!')
                    .setDescription(`\*\*Player List:\*\*\n${playerList}`)
                console.log(UnoConfig.players);
                UnoConfig.currentState = "PLAYING";

                break;
            
            case "PLAYING":
                embed.setTitle('Error!')
                    .setDescription('There is a game in progress.\nType \`.stop\` to stop the game.')
                message.channel.send('There is a game already in session!');
                break;
        }


        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('join')
                .setLabel('Join')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('stat')
                .setLabel('Start')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('stop')
                .setLabel('Stop')
                .setStyle('DANGER'),
            
        );
        
        message.channel.send({embeds: [embed], components: [row]});
    }

});






/* Archive (i'll delete later)

    message.channel.send({embeds: [embed]}).then(embedMessage => {
        embedMessage.react('✋')
        embedMessage.react('✅')
        embedMessage.react('❌');
    });

*/