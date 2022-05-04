'use strict';

import { Scenes, Composer } from 'telegraf';

import * as keyboards from './keyboards.js';

const startCheckPriceScene = new Composer();
startCheckPriceScene.on('text', async (ctx) => {
    await ctx.reply('Оберіть категорію продукту:',
        keyboards.createTypesKeyboard());
    return ctx.wizard.next();
});

const selectProduct = new Composer();
for (const type of keyboards.getTypesList()) {
    selectProduct.action(type, async (ctx) => {
        await ctx.reply('Оберіть продукт:', 
            keyboards.createProductsKeyboards()[type]);
        return ctx.wizard.next();
    });
}

selectProduct.action('Cancel', async (ctx) => {
    return ctx.scene.leave();
});

const sendPrice = new Composer();
sendPrice.action('product1', async (ctx) => {
    await ctx.reply('*ціна першого продукту*');
    return ctx.scene.leave();
});

sendPrice.action('product2', async (ctx) => {
    await ctx.reply('*ціна другого продукту*');
    return ctx.scene.leave();
});

sendPrice.action('product3', async (ctx) => {
    await ctx.reply('*ціна третього продукту*');
    return ctx.scene.leave();
});

sendPrice.action('product4', async (ctx) => {
    await ctx.reply('*ціна четвертого продукту*');
    return ctx.scene.leave();
});

sendPrice.action('Cancel', (ctx) => {
    return ctx.wizard.back();
});

const checkProductPriceScene = new Scenes.WizardScene(
    'checkProductPriceScene', 
    startCheckPriceScene, 
    selectProduct, 
    sendPrice
);

export { checkProductPriceScene };