'use strict';

import { Markup } from 'telegraf';
import { getXlsxData } from './parsers/parser.xlsx.js';

// *****************
// ДОПОМІЖНІ ФУНКЦІЇ
// *****************

function seperateNamesByLength(dataArray) {
    const MAX_LENGTH = 20;
    const shortNames = dataArray.filter(elem => elem.length <= MAX_LENGTH);
    const longNames = dataArray.filter(elem => elem.length > MAX_LENGTH);
    return [ shortNames, longNames ];
}

// Створення кнопки для Inline-клавіатури
function button(elem) {
    return Markup.button.callback(elem, elem);
}

// *****************************************
// СТВОРЕННЯ МАСИВІВ ЕЛЕМЕНТІВ ДЛЯ КЛАВІАТУР
// *****************************************

// Створення масиву для клавіатури в один стовпчик
function createButtonsOneColumn(dataArray) {
    return dataArray.map(elem => [ button(elem) ]);
}

function createButtonsTwoColumn(dataArray) {
    const len = dataArray.length;
    const buttons = [];

    for (let i = 1; i < len; i += 2) {
        const firstElem = dataArray[i - 1];
        const secondElem = dataArray[i];
        buttons.push([ button(firstElem), button(secondElem) ]);
    }

    if (len % 2 !== 0) {
        const lastElem = dataArray[len - 1];
        buttons.push([ button(lastElem) ]);
    }

    return buttons;
}

// Створення масиву кнопок для клавіатури
function createArrayForKeyboard(dataArray) {
    const [ shortNames, longNames ] = seperateNamesByLength(dataArray);

    const shortButtons = createButtonsTwoColumn(shortNames);
    const longButtons = createButtonsOneColumn(longNames);
    
    const allButtons = shortButtons.concat(longButtons);
    return allButtons;
}

// *******************
// СТВОРЕННЯ КЛАВІАТУР
// *******************

function createKeyboard(dataArray, params = { backButton: false, oneColumn: false }) {
    const buttons = params.oneColumn ? 
        createButtonsOneColumn(dataArray) :
        createArrayForKeyboard(dataArray);

    if (params.backButton) buttons.push([ button('Назад') ]);
    return Markup.inlineKeyboard(buttons);         
}

// Створення клавіатур для кожної категорії продуктів
function createProductsKeyboards() {
    const xlsxData = getXlsxData();
    const typesList = Object.keys(xlsxData);
    const keyboardsByTypes = {};

    for (const type of typesList) {
        const products = xlsxData[type];
        const productsNames = products.map(elem => elem.name);
        keyboardsByTypes[type] = createKeyboard(productsNames, { backButton: true });
    }

    return keyboardsByTypes;
}

// ********
// ЕКСПОРТ
// ********

export {
    createKeyboard,
    createProductsKeyboards
};