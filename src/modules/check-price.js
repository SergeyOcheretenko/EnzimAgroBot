'use strict';

// Імпорт бібліотек для створення сцен
import { Scenes, Composer, session } from 'telegraf';

// Імпорт конструкторів клавіатур
import * as keyboards from './keyboards.js';
import { getProductsWithPrices, getAllPackageVariants } from './parse-xlsx.js';

// Окрема функція, що надсилає список категорій користувачу
async function sendCategories(ctx) {
    await ctx.reply('Оберіть категорію продукту:',
        keyboards.createTypesKeyboard());
    return;
}

function convertObjectToArray(object) {
    const array = [];
    for (const key in object) {
        array.push(key);
    }
    return array;
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

            await ctx.reply('Оберіть продукт:', 
                keyboards.createProductsKeyboards()[type]);
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

    sendPackageVariants.action('Back', (ctx) => {
        sendCategories(ctx);
        return ctx.wizard.back();
    });

    // Четвертий крок сцени - отримання ціни продукту після обирання варіанту упаковки
    const sendPrice = new Composer();
    for (const packageType of getAllPackageVariants()) {
        sendPrice.action(packageType, async (ctx) => {
            const sessionProduct = ctx.session.product;
            const sessionProductPackageVariants = allProductsWithPrices[sessionProduct];
            const sessionPriceBySelectedPackage = sessionProductPackageVariants[packageType];
            
            await ctx.replyWithHTML(`<b>${sessionProduct}</b> <i>(${packageType})</i>: <b>${sessionPriceBySelectedPackage} USD.</b>`);
            return ctx.scene.leave();
        });
    }

    const checkPriceScene = new Scenes.WizardScene(
        'checkPriceScene', 
        startCheckPriceScene, 
        selectProduct, 
        sendPackageVariants,
        sendPrice
    );

    return checkPriceScene;
}

export { createCheckPriceScene };