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
        if (!UnoConfig.players[message.author.id].playerNumber == UnoConfig.playerOrder[0]) {
            embed.setColor('RED')
                .setTitle('Invalid!')
                .setDescription(`It is Player ${UnoConfig.playerOrder[0]}'s turn!'`);
            return;
        }
        const outcome = isCardPlayable(args[1],message, client)
        if (outcome == 1) {
            card = Game.printCard(Game.getCardFromIndex(args[1],message.author.id));
            embed.setColor('GREEN')
                .setTitle('Success!')
                .setDescription(`You played a ${card}`);

            const channelEmbed = new MessageEmbed();
            channelEmbed.setColor('GREEN')
                .setTitle(`It is Player ${UnoConfig.playerOrder[0]}'s turn!`)
                .setAuthor(message.author.username, message.author.avatarURL({dynamic:true}))
                .setDescription(`${message.author.username} has played a ${Game.printCard(Game.getCardFromIndex(args[1],message.author.id))}`);

            client.channels.fetch(UnoConfig.channelId).then(channel => {
                // channel.send({embeds:[channelEmbed]});
            });
            UnoConfig.currentCard = Game.getCardFromIndex(args[1], message.author.id);
            Game.removeCard(args[1].split('d')[1], message.author.id);
            Game.turn(client);
        } else if (outcome == -1) {
            embed.setColor('RED')
                .setTitle('Invalid!')
                .setDescription(`Please type \`.play card[number]\` to play a card.`);
        } else {
            return;
        }
        
        message.channel.send({embeds: [embed]});
    }

});

// checking if card can be played
function isCardPlayable(playedCard, message, client) {
    if (playedCard == null || playedCard.toLowerCase() == 'card' || !playedCard.toLowerCase().startsWith('card')) {
        console.log('invalid')
        return -1;
    } else if (playedCard.split('d')[1] > UnoConfig.players[message.author.id].hand.length) {
        console.log('number too high');
        return -1;
    }
    // check if card is in player's hands
    cardNumber = playedCard.split('d')[1];
    const currentCardColor = UnoConfig.currentCard.split('.')[0];
    const currentCardValue = UnoConfig.currentCard.split('.')[1];
    card = UnoConfig.players[message.author.id].hand[cardNumber-1];
    const playedCardColor = card.split('.')[0];
    const playedCardValue = card.split('.')[1];
    // console.log(`${UnoConfig.currentCard}`);

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

            client.channels.fetch(UnoConfig.channelId).then(channel => {
                // channel.send({embeds:[channelEmbed]});
            });
            // UnoConfig.currentCard = Game.getCardFromIndex(playedCard, message.author.id);
            Game.removeCard(playedCard.split('d')[1], message.author.id);
            Game.getNextPlayer();
            Game.turn(client);
            return 0; 
        })

        
    } else if (playedCardColor == currentCardColor || playedCardValue == currentCardValue || playedCardColor == 'WILD') {
        console.log(`${message.author.username} played a ${Game.printCard(Game.getCardFromIndex(playedCard,message.author.id))}`);
        // console.log(playedCardColor + "    " + playedCardValue);
        // console.log(UnoConfig.playerOrder);
        
        Game.getNextPlayer();


        return 1;
    } else {
        console.log('not playable');
        return -1;
    }
}