'use strict';

import { Markup } from 'telegraf';

import { getXlsxData } from './parse-xlsx.js'

// Отримання категорій продуктів Enzim Agro з отриманих XLSX-даних
function getTypesList() {
    const xlsxData = getXlsxData();
    const types = [];
    for (const productTypeObject of xlsxData) {
        types.push(productTypeObject.productType);
    }
    return types;
}

// Створення клавіатури з непарною кількістю елементів
function oddNumberElements(dataArray) {
    const arrayForKeyboard = [];

    const len = dataArray.length;
    const lastElem = dataArray[len - 1];
    for (let i = 0; i < len - 1; i += 2) {
        const currentElem = dataArray[i];
        const nextElem = dataArray[i + 1];

        arrayForKeyboard.push([ 
            Markup.button.callback(currentElem, currentElem), 
            Markup.button.callback(nextElem, nextElem) 
        ]);
    }
    arrayForKeyboard.push([
        Markup.button.callback(lastElem, lastElem)
    ]);

    return arrayForKeyboard;
}

// Створення клавіатури з парною кількістю елементів
function evenNumberElements(dataArray) {
    const arrayForKeyboard = [];

    const len = dataArray.length;
    for (let i = 0; i < len; i += 2) {
        const currentElem = dataArray[i];
        const nextElem = dataArray[i + 1];
        arrayForKeyboard.push([ 
            Markup.button.callback(currentElem, currentElem), 
            Markup.button.callback(nextElem, nextElem) 
        ]);
    }

    return arrayForKeyboard;
}

// Динамічне створення клавіатури з отриманого масиву елементів
function createKeyboard(dataArray) {
    const len = dataArray.length;

    const arrayForKeyboard = (len % 2 === 0 ?
        evenNumberElements(dataArray) :
        oddNumberElements(dataArray));
    
    return Markup.inlineKeyboard(arrayForKeyboard);
}

// Створення клавіатури з категоріями продуктів
function createTypesKeyboard() {
    const typesList = getTypesList();
    return createKeyboard(typesList);
}

// Створення тестових клавіатур для кожної категорії продуктів
function createProductsKeyboards() {
    const keyboardsByTypes = {};
    for (const type of getTypesList()) {
        keyboardsByTypes[type] = Markup.inlineKeyboard([
            [
                Markup.button.callback('Товар 1', 'product1'),
                Markup.button.callback('Товар 2', 'product2')
            ],
            [
                Markup.button.callback('Товар 3', 'product3'),
                Markup.button.callback('Товар 4', 'product4')
            ],
            [
                Markup.button.callback('Відміна', 'Cancel')
            ]
        ]);
    }

    return keyboardsByTypes;
}

export {
    getTypesList,
    createTypesKeyboard,
    createProductsKeyboards
};