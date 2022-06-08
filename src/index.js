'use strict';

import { Telegraf, Scenes, session } from 'telegraf';


import { parseJSON } from './modules/parsers/parser.json.js';
import { createCheckPriceScene } from './modules/scenes/scene.price.js';
import { dollarScene } from './modules/scenes/scene.dollar.js';

const CONFIG = parseJSON('CONFIG.json');
const BOT_TOKEN = CONFIG.bot_token;
const bot = new Telegraf(BOT_TOKEN);

let checkPriceScene = createCheckPriceScene();

const stage = new Scenes.Stage([
    checkPriceScene,
    dollarScene
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
    await ctx.scene.enter('dollarScene');
});

bot.launch();