'use strict';

import { Markup } from 'telegraf';
import { PRODUCTS } from './test-products.js';

function createTypesKeyboard(products) {
    const productTypesList = [];
    for (const type in products) {
        console.log(type)
        productTypesList.push(products[type].ukrainianName);
    }
    console.log(productTypesList)
    const len = productTypesList.length;
    const keyboard = [];

    if (len % 2 === 0) {
        for (let i = 0; i < len; i += 2) {
            const currentType = productTypesList[i];
            const nextType = productTypesList[i + 1];
            keyboard.push([ 
                Markup.button.callback(currentType, currentType), 
                Markup.button.callback(nextType, nextType) 
            ]);
        }
    } else {
        const lastType = productTypesList[len - 1];
        for (let i = 0; i < len - 1; i += 2) {
            keyboard.push([ 
                Markup.button.callback(currentType, currentType), 
                Markup.button.callback(nextType, nextType) 
            ]);
        }
        keyboard.push([
            Markup.button.callback(lastType, lastType)
        ]);
    }

    return keyboard;
}

export const productTypesKeyboard = Markup.inlineKeyboard(
    createTypesKeyboard(PRODUCTS)
);

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
        Markup.button.callback('Відміна', 'Cancel')
    ]
]);

export const fungicidesKeyboard = Markup.inlineKeyboard([
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

export const complexAdditivesKeyboard = Markup.inlineKeyboard([
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

export const annoculantsKeyboard = Markup.inlineKeyboard([
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