const Discord = require('discord.js');
const config = require('../Data/config.json');


class Card {
    constructor(card) {
        this.color = card.color;
        this.value = card.value;
        /*
        0-9 => normal numbers
        10 => reverse
        11 => skip
        12 => plusTwo
        13 => wild
        14 => plusFour


        */

    }

    
}