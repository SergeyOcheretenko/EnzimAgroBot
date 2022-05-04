'use strict';

import { Markup } from 'telegraf';

import { getXlsxData } from './parse-xlsx.js'

export function getTypesList() {
    const xlsxData = getXlsxData();
    const types = [];
    for (const productTypeObject of xlsxData) {
        types.push(productTypeObject.productType);
    }
    return types;
}

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

export function createTypesKeyboard() {
    const typesList = getTypesList();

    const len = typesList.length;
    const keyboardArray = (len % 2 === 0 ?
        evenNumberTypes(typesList) :
        oddNumberTypes(typesList));
    
    return Markup.inlineKeyboard(keyboardArray);
}

export const insecticidesKeyboard = Markup.inlineKeyboard([
    [
        Markup.button.callback('Товар 1', 'product1'),
        Markup.button.callback('Товар 2', 'product2')
    ],
    [
        Markup.button.callback('Товар 3', 'product3'),
        Markup.button.callback('Товар 4', 'product4')
    ],
    [
        Markup.button.callback('Назад', 'Cancel')
    ]
]);

export function createProductsKeyboards() {
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