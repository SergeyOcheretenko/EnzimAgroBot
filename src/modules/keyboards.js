'use strict';

import { Markup } from 'telegraf';

import { getXlsxData, getTypesList } from './parsers/parser.xlsx.js'

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

// Створення кнопки для Inline-клавіатури
function button(elem) {
    return Markup.button.callback(elem, elem);
}

// *****************************************
// СТВОРЕННЯ МАСИВІВ ЕЛЕМЕНТІВ ДЛЯ КЛАВІАТУР
// *****************************************

// Створення масиву для клавіатури в один стовпчик
function arrayForOneColumnKeyboard(dataArray) {
    return dataArray.map(elem => [ button(elem) ]);
}

// Створення клавіатури з парною кількістю елементів
function evenNumberElements(dataArray) {
    const arrayForKeyboard = [];

    for (let i = 0; i < dataArray.length; i += 2) {
        const currentElem = dataArray[i];
        const nextElem = dataArray[i + 1];
        arrayForKeyboard.push([ button(currentElem), button(nextElem) ]);
    }
    return arrayForKeyboard;
}

// Створення клавіатури з непарною кількістю елементів
function oddNumberElements(dataArray) {
    const len = dataArray.length;
    const arrayForKeyboard = evenNumberElements(dataArray.slice(0, len - 1));

    const lastElem = dataArray[len - 1];
    arrayForKeyboard.push([ button(lastElem) ]);
    return arrayForKeyboard;
}

// Створення масиву кнопок для клавіатури
function createArrayForKeyboard(dataArray) {
    const shortNames = dataArray.filter(elem => elem.length <= 20);
    const longNames = dataArray.filter(elem => elem.length > 20);

    const arrayOfShortForKeyboard = (shortNames.length % 2 === 0 ?
        evenNumberElements(shortNames) :
        oddNumberElements(shortNames)
    );
    const arrayOfLongForKeyboard = arrayForOneColumnKeyboard(longNames);
    
    const arrayForKeyboard = [...arrayOfShortForKeyboard, ...arrayOfLongForKeyboard];
    return arrayForKeyboard;
}

// *******************
// СТВОРЕННЯ КЛАВІАТУР
// *******************

// КЛАВІАТУРА В ОДИН СТОВПЧИК
// КЛАВІАТУРА З КНОПКОЮ "НАЗАД"
// КЛАВІАТУРА З ТИПАМИ ПРОДУКЦІЇ
// ХЕШ-ТАБЛИЦЯ КЛАВІАТУР ПРОДУКТІВ ВІДПОВІДНО ДО ТИПІВ

// Створення клавіатури в один стовпчик
function createKeyboardInOneColumn(dataArray) {
    const arrayForKeyboard = arrayForOneColumnKeyboard(dataArray);
    return Markup.inlineKeyboard(arrayForKeyboard);
}

// Створення клавіатури з кнопкою "Назад"
function createKeyboardWithBackButton(dataArray) {
    const arrayForKeyboard = createArrayForKeyboard(dataArray);
    arrayForKeyboard.push([ button('Назад') ]);
    return Markup.inlineKeyboard(arrayForKeyboard);
}

// Створення клавіатури з категоріями продуктів
function createTypesKeyboard() {
    const typesList = getTypesList();
    const arrayForKeyboard = createArrayForKeyboard(typesList);
    return Markup.inlineKeyboard(arrayForKeyboard);
}

// Створення клавіатур для кожної категорії продуктів
function createProductsKeyboards() {
    const keyboardsByTypes = {};
    
    const typesList = getTypesList();
    const xlsxData = getXlsxData();

    for (const type of typesList) {
        const productsList = findNeededProductsByType(xlsxData, type).products;
        const productsNames = productsList.map(elem => elem.name);
        keyboardsByTypes[type] = createKeyboardWithBackButton(productsNames);
    }

    return keyboardsByTypes;
}

// ********
// ЕКСПОРТ
// ********

export {
    getTypesList,
    createTypesKeyboard,
    createProductsKeyboards,
    createKeyboardWithBackButton,
    createKeyboardInOneColumn
};