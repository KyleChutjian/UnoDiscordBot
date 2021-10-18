const Discord = require('discord.js');
const config = require('../Data/config.json');


class Card {
    /**
     * 
     * @param {int} color 
     * @param {int} value 
     */
    constructor(color, value) {
        this.color = getColor(color);
        this.value = getValue(value);
    }
}

function getColor(colorInt) {
    switch (colorInt) {
        case 0:
            return "RED";
        case 1:
            return "BLUE";
        case 2:
            return "YELLOW";
        case 3:
            return "GREEN";
    }
}
function getValue(valueInt) {
    switch (valueInt) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            return valueInt;
        case 10:
            return "REVERSE";
        case 11:
            return "SKIP";
        case 12:
            return "PLUSTWO";
        case 13:
            return "WILD";
        case 14:
            return "PLUSFOUR";
    }
}
module.exports = Card;