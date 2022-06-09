'use strict';

import { Telegraf, Scenes, session } from 'telegraf';
import config from '../CONFIG.js'
import createCheckPriceScene     from './modules/scenes/scene.price.js';
import { getUSDRate } from './modules/currency/currency.js';
import {getXlsxData} from './modules/parsers/parser.xlsx.js';
const obj = getXlsxData();
console.dir({ obj }, {depth: 20});

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
    await ctx.replyWithHTML(`Поточний курс USD: <b>${getUSDRate()} грн.</b>`);
});

bot.launch();