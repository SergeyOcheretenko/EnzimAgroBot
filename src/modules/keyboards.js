'use strict';

import { Markup } from 'telegraf';
import { getXlsxData, getTypesList } from './parsers/parser.xlsx.js';

// *****************
// ДОПОМІЖНІ ФУНКЦІЇ
// *****************

// Функція, яка знаходить потрібний об'єкт з видом продукції та продуктами цього виду
function findNeededProductsByType(array, neededType) {
    for (const object of array) {
        if (object.productType === neededType) {
            return object;
        }
    }
}

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

    for (let i = 0; i < len; i += 2) {
        const firstElem = dataArray[i];
        const secondElem = dataArray[i + 1];
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
    const [ shortNames, longNames ] = seperateNamesByLength(data);

    const shortButtons = createButtonsOneColumn(shortNames);
    const longButtons = createButtonsTwoColumn(longNames);
    
    const allButtons = shortButtons.concat(longButtons);
    return allButtons;
}

// *******************
// СТВОРЕННЯ КЛАВІАТУР
// *******************

function createKeyboard(dataArray, { backButton = false, oneColumn = false }) {
    const buttons = oneColumn ? 
        createButtonsOneColumn(dataArray) :
        createArrayForKeyboard(dataArray);

    if (backButton) buttons.push([ button('Назад') ]);
    return Markup.inlineKeyboard(buttons);         
}

// Створення клавіатур для кожної категорії продуктів
function createProductsKeyboards() {
    const keyboardsByTypes = {};
    
    const typesList = getTypesList();
    const xlsxData = getXlsxData();

    for (const type of typesList) {
        const productsList = findNeededProductsByType(xlsxData, type).products;
        const productsNames = productsList.map(elem => elem.name);
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