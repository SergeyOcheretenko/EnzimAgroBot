'use strict';

// Імпорт бібліотек для створення сцен
import { Scenes, Composer, session } from 'telegraf';

// Імпорт конструкторів клавіатур
import * as keyboards from './keyboards.js';
import { getProductsWithPrices } from './parse-xlsx.js';

// Окрема функція, що надсилає список категорій користувачу
async function sendCategories(ctx) {
    await ctx.reply('Оберіть категорію продукту:',
        keyboards.createTypesKeyboard());
    return;
}

function createCheckPriceScene() {
    // Перший крок сцени - надсилання списку категорій
    const startCheckPriceScene = new Composer();
    startCheckPriceScene.on('text', async (ctx) => {
        sendCategories(ctx);
        return ctx.wizard.next();
    });

    // Другий крок сцени - надсилання списку продуктів обраної категорії
    const selectProduct = new Composer();
    for (const type of keyboards.getTypesList()) {
        selectProduct.action(type, async (ctx) => {
            ctx.session.type = type;
            await ctx.reply('Оберіть продукт:', 
                keyboards.createProductsKeyboards()[type]);
            return ctx.wizard.next();
        });
    }

    // Третій крок сцени - надсилання ціни обраного продукту
    const sendPrice = new Composer();
    const allProductsWithPrices = getProductsWithPrices();
    console.log(allProductsWithPrices);
    
    for(const product in allProductsWithPrices) {
        sendPrice.action(product, async (ctx) => {
            await ctx.reply(`${allProductsWithPrices[product]} USD.`);
            return ctx.scene.leave();
        });
    }

    sendPrice.action('Back', (ctx) => {
        sendCategories(ctx);
        return ctx.wizard.back();
    });

    const checkPriceScene = new Scenes.WizardScene(
        'checkPriceScene', 
        startCheckPriceScene, 
        selectProduct, 
        sendPrice
    );

    return checkPriceScene;
}

export { createCheckPriceScene };