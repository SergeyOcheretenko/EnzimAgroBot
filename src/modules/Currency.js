'use strict';

class Currency {
    getUSDRate() {
        const dollarStr = parseTXT('/home/ocheretenko/kurs.txt').replace(',', '.');
        return Number(dollarStr);
    }
}

export default new Currency();