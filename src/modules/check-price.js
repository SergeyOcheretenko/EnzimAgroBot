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
selectProduct.action('Insecticides', async (ctx) => {
    await ctx.reply('Оберіть продукт:', 
        keyboards.insecticidesKeyboard);
    return ctx.wizard.next();
});

selectProduct.action('Fungicides', async (ctx) => {
    await ctx.reply('Оберіть продукт:', 
        keyboards.fungicidesKeyboard);
    return ctx.wizard.next();
});

selectProduct.action('ComplexAdditives', async (ctx) => {
    await ctx.reply('Оберіть продукт:', 
        keyboards.complexAdditivesKeyboard);
    return ctx.wizard.next();
});

selectProduct.action('Annoculants', async (ctx) => {
    await ctx.reply('Оберіть продукт:', 
        keyboards.annoculantsKeyboard);
    return ctx.wizard.next();
});

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

sendPrice.action('Cancel', async (ctx) => {
    return ctx.scene.leave();
});

const checkProductPriceScene = new Scenes.WizardScene(
    'checkProductPriceScene', 
    startCheckPriceScene, 
    selectProduct, 
    sendPrice
);

export { checkProductPriceScene };