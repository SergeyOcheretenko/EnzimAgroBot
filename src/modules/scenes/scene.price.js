'use strict';

import { Scenes, Composer, session } from 'telegraf';

import { getUAHPrice } from '../currency/currency.js';
import Keyboard from '../keyboards/Keyboard.js';
import ProductController from '../ProductController.js';

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
    const productTypes = ProductController.getTypeList();
    ctx.reply('Оберіть категорію препаратів:',
        Keyboard.createKeyboard( productTypes ));
    return;
}

// Функція, що надсилає користувачу список продуктів за обраним типом продукції
function sendProducts(ctx, productType) {
    const productsOfThisType = ProductController.getProductsByType(productType);
    ctx.reply(
        'Оберіть препарат:', 
        Keyboard.createKeyboard(productsOfThisType, { backButton: true })
    );
    return;
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
    const typeList = ProductController.getTypeList();
    for (const type of typeList) {
        selectProduct.action(type, async (ctx) => {
            ctx.session.type = type;
            
            await sendProducts(ctx, type);
            return ctx.wizard.next();
        });
    }

    // Третій крок сцени - надсилання варіантів упаковки
    const sendPackageVariants = new Composer();
    const allProductsWithPrices = ProductController.getAllProductsWithPrices();
    
    for (const product in allProductsWithPrices) {
        sendPackageVariants.action(product, async (ctx) => {
            ctx.session.product = product;

            const productSales = allProductsWithPrices[product];
            const packageVariants = Object.keys(productSales);
            await ctx.reply('Оберіть варіант упаковки:', 
                Keyboard.createKeyboard(packageVariants, { backButton: true }));
                
            return ctx.wizard.next();
        });
    }

    sendPackageVariants.action('Назад', (ctx) => {
        sendCategories(ctx);
        return ctx.wizard.back();
    });

    // Четвертий крок сцени - отримання ціни продукту після обирання варіанту упаковки
    const sendPrice = new Composer();
    const allPackages = ProductController.getAllPackageVariants();
    for (const packageType of allPackages) {
        sendPrice.action(packageType, async (ctx) => {
            const sessionProduct = ctx.session.product;
            const packagesWithPrice = allProductsWithPrices[sessionProduct];
            const sessionPrice = packagesWithPrice[packageType];
            
            await ctx.replyWithHTML(
                answerTemplate(sessionProduct, packageType, sessionPrice), 
                Keyboard.createKeyboard([ 'Категорії препаратів' ], { oneColumn: true })    
            );
            return ctx.wizard.next();
        });
    }

    sendPrice.action('Назад', (ctx) => {
        sendProducts(ctx, ctx.session.type);
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