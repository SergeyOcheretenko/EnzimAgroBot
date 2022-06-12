'use strict';

import { Scenes, Composer, session } from 'telegraf';

import Currency from '../Currency.js';
import Keyboard from '../keyboards/Keyboard.js';
import ProductController from '../ProductController.js';
import Session from './Session.js';

// *****************
// ДОПОМІЖНІ ФУНКЦІЇ
// *****************

function answerTemplate(product, packageType, priceInUSD) {
    return `<b>Продукт:</b> ${product}\n` + 
        `<b>Упаковка:</b> ${packageType}\n` +
        `<b>Ціна в USD:</b> ${priceInUSD} USD\n` + 
        `<b>Ціна в ГРН:</b> ${Currency.convertToUAH(priceInUSD)} грн.`
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
    const productsByType = ProductController.getProductsByType(productType);
    ctx.reply(
        'Оберіть препарат:', 
        Keyboard.createKeyboard(productsByType, { backButton: true })
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
    const sendProductsByType = new Composer();
    const typeList = ProductController.getTypeList();

    for (const type of typeList) {
        sendProductsByType.action(type, async (ctx) => {
            Session.type = type;
            await sendProducts(ctx, type);
            return ctx.wizard.next();
        });
    }

    // Третій крок сцени - надсилання варіантів упаковки
    const sendPacksByProduct = new Composer();
    const productList = ProductController.getProductList();
    
    for (const productName of productList) {
        sendPacksByProduct.action(productName, async (ctx) => {
            Session.productName = productName;

            const packs = ProductController.getPackagesByName(productName);
            await ctx.reply('Оберіть варіант упаковки:', 
                Keyboard.createKeyboard(packs, { backButton: true }));
                
            return ctx.wizard.next();
        });
    }

    sendPacksByProduct.action('Назад', (ctx) => {
        sendCategories(ctx);
        return ctx.wizard.back();
    });

    // Четвертий крок сцени - отримання ціни продукту після обирання варіанту упаковки
    const sendPrice = new Composer();
    const allPacks = ProductController.getAllPackageVariants();
    for (const pack of allPacks) {
        sendPrice.action(pack, async (ctx) => {
            const sessionProduct = Session.productName;
            const sessionPrice = ProductController.getPriceByNameAndPackage(sessionProduct, pack);
            
            await ctx.replyWithHTML(
                answerTemplate(sessionProduct, pack, sessionPrice), 
                Keyboard.createKeyboard([ 'Категорії препаратів' ], { oneColumn: true })    
            );
            return ctx.wizard.next();
        });
    }

    sendPrice.action('Назад', (ctx) => {
        sendProducts(ctx, Session.type);
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
        sendProductsByType, 
        sendPacksByProduct,
        sendPrice,
        startAgain
    );

    return checkPriceScene;
}

export default createCheckPriceScene;