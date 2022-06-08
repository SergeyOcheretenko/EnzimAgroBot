'use strict';

import { Scenes, Composer, session } from 'telegraf';

import * as keyboards from '../keyboards.js';
import { getProductsWithPrices, getAllPackageVariants } from '../parsers/parser.xlsx.js';
import { getUAHPrice } from '../currency/currency.js';

// *****************
// ДОПОМІЖНІ ФУНКЦІЇ
// *****************

function answerTemplate(product, packageType, priceInUSD) {
    return `<b>Продукт:</b> ${product}\n` + 
        `<b>Упаковка:</b> ${packageType}\n` +
        `<b>Ціна в USD:</b> ${priceInUSD} USD\n` + 
        `<b>Ціна в ГРН:</b> ${getUAHPrice(priceInUSD)} грн.`
}

// *************************************************************
// ФУНКЦІЇ, ЩО НАДСИЛАЮТЬ КОРИСТУВАЧУ СПИСКИ ТИПІВ АБО ПРОДУКТІВ
// *************************************************************

// Функція, що надсилає список категорій користувачу
function sendCategories(ctx) {
    ctx.reply('Оберіть категорію препаратів:',
        keyboards.createTypesKeyboard());
    return;
}

// Функція, що надсилає користувачу список продуктів за обраним типом продукції
function sendProducts(ctx, productsType) {
    ctx.reply(
        'Оберіть препарат:', 
        keyboards.createProductsKeyboards()[productsType]
    );
    return;
}

function convertObjectToArray(object) {
    const array = [];
    for (const key in object) {
        array.push(key);
    }
    return array;
}

// *****************************************************************
// ФУНКЦІЯ, ЩО ДИНАМІЧНО СТВОРЮЄ СЦЕНУ ПРИ ЗАПУСКУ ФУНКЦІЇ
//
// ПЕРЕСТВОРЕННЯ СЦЕНИ ПОТРІБНЕ ДЛЯ ДИНАМІЧНОГО СТВОРЕННЯ ОБРОБНИКІВ 
// КНОПОК В ЗАЛЕЖНОСТІ ВІД ПОТОЧНОГО СТАНУ XLSX-ФАЙЛУ
// *****************************************************************

function createCheckPriceScene() {
    // Перший крок сцени - надсилання списку категорій
    const startCheckPriceScene = new Composer();
    startCheckPriceScene.on('text', async (ctx) => {
        sendCategories(ctx);
        return ctx.wizard.next();
    });

    // Другий крок сцени - надсилання списку продуктів обраної категорії
    const selectProduct = new Composer();
    for (const productsType of keyboards.getTypesList()) {
        selectProduct.action(productsType, async (ctx) => {
            ctx.session.productsType = productsType;
            
            await sendProducts(ctx, productsType);
            return ctx.wizard.next();
        });
    }

    // Третій крок сцени - надсилання варіантів упаковки
    const sendPackageVariants = new Composer();
    const allProductsWithPrices = getProductsWithPrices();
    
    for (const product in allProductsWithPrices) {
        sendPackageVariants.action(product, async (ctx) => {
            ctx.session.product = product;

            const productSaleVariants = allProductsWithPrices[product];
            const packageVariantsArray = convertObjectToArray(productSaleVariants);
            await ctx.reply('Оберіть варіант упаковки:', 
                keyboards.createKeyboardWithBackButton(packageVariantsArray));
                
            return ctx.wizard.next();
        });
    }

    sendPackageVariants.action('Назад', (ctx) => {
        sendCategories(ctx);
        return ctx.wizard.back();
    });

    // Четвертий крок сцени - отримання ціни продукту після обирання варіанту упаковки
    const sendPrice = new Composer();
    for (const packageType of getAllPackageVariants()) {
        sendPrice.action(packageType, async (ctx) => {
            const sessionProduct = ctx.session.product;
            const sessionPackageVariants = allProductsWithPrices[sessionProduct];
            const sessionPrice = sessionPackageVariants[packageType];
            
            await ctx.replyWithHTML(
                answerTemplate(sessionProduct, packageType, sessionPrice), 
                keyboards.createKeyboardInOneColumn([ 'Категорії препаратів' ])    
            );
            return ctx.wizard.next();
        });
    }

    sendPrice.action('Назад', (ctx) => {
        sendProducts(ctx, ctx.session.productsType);
        return ctx.wizard.back();
    });

    const startAgain = new Composer();
    startAgain.action('Категорії препаратів', async (ctx) => {
        sendCategories(ctx);
        ctx.wizard.back();
        ctx.wizard.back();
        ctx.wizard.back();
    });

    const checkPriceScene = new Scenes.WizardScene(
        'checkPriceScene', 
        startCheckPriceScene, 
        selectProduct, 
        sendPackageVariants,
        sendPrice,
        startAgain
    );

    return checkPriceScene;
}

export default createCheckPriceScene;