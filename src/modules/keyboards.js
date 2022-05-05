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
function oddNumberTypes(typesList) {
    const keyboardArray = [];

    const len = typesList.length;
    const lastType = typesList[len - 1];
    for (let i = 0; i < len - 1; i += 2) {
        const currentType = typesList[i];
        const nextType = typesList[i + 1];
        keyboardArray.push([ 
            Markup.button.callback(currentType, currentType), 
            Markup.button.callback(nextType, nextType) 
        ]);
    }
    keyboardArray.push([
        Markup.button.callback(lastType, lastType)
    ]);

    return keyboardArray;
}

// Створення клавіатури з парною кількістю елементів
function evenNumberTypes(typesList) {
    const keyboardArray = [];

    const len = typesList.length;
    for (let i = 0; i < len; i += 2) {
        const currentType = typesList[i];
        const nextType = typesList[i + 1];
        keyboardArray.push([ 
            Markup.button.callback(currentType, currentType), 
            Markup.button.callback(nextType, nextType) 
        ]);
    }

    return keyboardArray;
}

// Динамічне створення клавіатури з отриманого масиву елементів
function createKeyboard(dataArray) {
    const len = dataArray.length;

    const arrayForKeyboard = (len % 2 === 0 ?
        evenNumberTypes(dataArray) :
        oddNumberTypes(dataArray));
    
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