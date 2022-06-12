'use strict';

import parseTXT from "./parsers/parser.txt.js";

class Currency {
    getUSDRate() {
        const dollarStr = parseTXT('/home/ocheretenko/kurs.txt').replace(',', '.');
        return Number(dollarStr);
    }

    convertToUAH(price) {
        const dollarRate = this.getUSDRate();
        return Math.round(price * dollarRate * 100) / 100;
    }
}

export default new Currency();