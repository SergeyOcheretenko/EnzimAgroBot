'use strict';

import { Telegraf, Scenes, session } from 'telegraf';
import config from '../CONFIG.js'
import createCheckPriceScene from './modules/scenes/scene.price.js';
import Currency from './modules/Currency.js';

const bot = new Telegraf(config.BOT_TOKEN);

let checkPriceScene = createCheckPriceScene();

const stage = new Scenes.Stage([
    checkPriceScene
]);

bot.use(session(), stage.middleware());

bot.command('start', (ctx) => {
    ctx.scene.enter('checkPriceScene')
});

bot.command('help', (ctx) => ctx.reply('Help for using the system'));

// Оновлення та запуск сцени з цінами продукції Enzim Agro
bot.command('price', (ctx) => {
    checkPriceScene = createCheckPriceScene();
    ctx.scene.enter('checkPriceScene');
});

bot.command('dollar', async (ctx) => {
    await ctx.replyWithHTML(`Поточний курс USD: <b>${Currency.getUSDRate()} грн.</b>`);
});

bot.launch();