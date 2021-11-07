const Command = require('../Structures/Command.js');
const {Client, MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction} = require('discord.js');
const Game = require('../Structures/Game.js');
const UnoConfig = require('../Data/uno.json')

module.exports = new Command({
    name: "play",
    permission: "SEND_MESSAGES",
    description: "Used to play a card",

    async run(message, args, client) {
        const embed = new MessageEmbed();
        embed.setAuthor(message.author.username, message.author.avatarURL({dynamic:true}));

        // Not current player's turn
        if (!UnoConfig.players[message.author.id].playerNumber == UnoConfig.playerOrder[0]) {
            embed.setColor('RED')
                .setTitle('Invalid!')
                .setDescription(`It is Player ${UnoConfig.playerOrder[0]}'s turn!'`);
            return;
        }
        const outcome = isCardPlayable(args[1],message, client)
        if (outcome == 1 && UnoConfig.players[message.author.id].hand.length == 1) {
            console.log(`${UnoConfig.players[message.author.id].username} wins`);
            embed.setColor('GREEN')
                .setTitle(`You Win!`)
                .setDescription(`Congratulations, you have won the game!`)
                .setImage('https://www.nicepng.com/png/detail/13-139694_congratulation-png-congratulations-clip-art.png');

            const channelEmbed = new MessageEmbed();
            channelEmbed.setColor('GREEN')
                .setTitle(`${message.author.username} has won the game!`)
                .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
                .setDescription(`He played a ${Game.printCard(Game.getCardFromIndex(args[1],message.author.id))} to win the game.`)
                .setImage('https://www.nicepng.com/png/detail/13-139694_congratulation-png-congratulations-clip-art.png');

           UnoConfig.currentState = "WAITING";
            message.channel.send({embeds:[embed]});
            client.channels.fetch(UnoConfig.channelId).then(channel => {
                channel.send({embeds:[channelEmbed]});
            });
            Game.resetGame();
            console.log('reset game is run');
            return;
        } else if (outcome == 1 && UnoConfig.players[message.author.id].hand.length == 2) {
            console.log(`${UnoConfig.players[message.author.id].username} uno`);
        }
        
        
        // NOT wild/+4
        if (outcome == 1 && UnoConfig.players[message.author.id].hand.length > 1) {
            card = Game.printCard(Game.getCardFromIndex(args[1],message.author.id));
            embed.setColor('GREEN')
                .setTitle('Success!')
                .setDescription(`You played a ${card}`);

            const channelEmbed = new MessageEmbed();
            channelEmbed.setColor('GREEN')
                .setTitle(`It is Player ${UnoConfig.playerOrder[0]}'s turn!`)
                .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
                .setDescription(`${message.author.username} has played a ${Game.printCard(Game.getCardFromIndex(args[1],message.author.id))}`);
            UnoConfig.currentCard = Game.getCardFromIndex(args[1], message.author.id);
            Game.removeCard(args[1].split('d')[1], message.author.id);
            Game.turn(client);
        // INVALID 
        } else if (outcome == -1) {
            embed.setColor('RED')
                .setTitle('Invalid!')
                .setDescription(`Please type \`.play card[number]\` to play a card.`);
        } else {return}
        message.channel.send({embeds: [embed]});
    }
});

// checking if card can be played
function isCardPlayable(playedCard, message, client) {
    // INVALID
    if (playedCard == null || playedCard.toLowerCase() == 'card' || !playedCard.toLowerCase().startsWith('card')) {return -1;} else if (playedCard.split('d')[1] > UnoConfig.players[message.author.id].hand.length) {return -1;}
    
    // "card4" => 4 => "RED" and "3"
    cardNumber = playedCard.split('d')[1];
    card = UnoConfig.players[message.author.id].hand[cardNumber-1];
    const playedCardColor = card.split('.')[0];
    const playedCardValue = card.split('.')[1];
    const currentCardColor = UnoConfig.currentCard.split('.')[0];
    const currentCardValue = UnoConfig.currentCard.split('.')[1];

    if (playedCardColor == 'WILD') {
        const chooseColorEmbed = new MessageEmbed();
        chooseColorEmbed.setTitle('Choose a Color!')
            .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
            .setColor('WHITE')
            .setDescription(`You played a ${Game.printCard(Game.getCardFromIndex(playedCard,message.author.id))}!\n
            What color do you want it to be?
            `);
        const filter = (interaction) => {return true;}
        const chooseColorRow = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('BLUE')
                .setLabel('Blue')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('RED')
                .setLabel('Red')
                .setStyle('DANGER'),
            new MessageButton()
                .setCustomId('GREEN')
                .setLabel('Green')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('YELLOW')
                .setLabel('Yellow')
                .setStyle('SECONDARY')
        );
        message.channel.send({embeds: [chooseColorEmbed], components: [chooseColorRow]});
        let collector = message.channel.createMessageComponentCollector({filter,max:1});

        collector.on('collect', async (ButtonInteraction) => {
            let newColor = ButtonInteraction.customId.toLowerCase();
            newColor = newColor.charAt(0).toUpperCase() + newColor.slice(1, newColor.length);
            ButtonInteraction.reply(`You picked ${newColor}`);
            const id = ButtonInteraction.customId;
            UnoConfig.currentCard = `${ButtonInteraction.customId}.${playedCardValue}`;
        });
        collector.on('end', (collection) => {
            const channelEmbed = new MessageEmbed();
            channelEmbed.setColor('GREEN')
                .setTitle(`It is Player ${UnoConfig.playerOrder[0]}'s turn!`)
                .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
                .setDescription(`${message.author.username} has played a ${Game.printCard(Game.getCardFromIndex(playedCard,message.author.id))}`);


            Game.removeCard(playedCard.split('d')[1], message.author.id);
            Game.getNextPlayer(card);
            Game.turn(client);
            return 0; 
        });
    } else if (playedCardColor == currentCardColor || playedCardValue == currentCardValue || playedCardColor == 'WILD') {
        console.log(`${message.author.username} played a ${Game.printCard(Game.getCardFromIndex(playedCard,message.author.id))}`);
        Game.getNextPlayer(card);
        return 1;
    } else {
        console.log('not playable');
        return -1;
    }
}