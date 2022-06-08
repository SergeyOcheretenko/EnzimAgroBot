'use strict';

import parseTXT from "../parsers/parser.txt.js";

// Повернення курсу USD з файлу TXT
function getUSDRate() {
    const dollarString = parseTXT('/home/ocheretenko/kurs.txt').replace(',', '.');
    return Number(dollarString);
}

function getUAHPrice(price) {
    const dollarRate = getUSDRate();
    return Math.round(price * dollarRate * 100) / 100;
}

export { getUSDRate, getUAHPrice };