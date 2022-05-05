'use strict';

// Імпорт зовнішніх бібліотек
import { Telegraf, Scenes, session } from 'telegraf';

// Імпорт локальних модулів
import { parseJSON } from './modules/work-with-json.js';
import { getAdmins } from './modules/admins-list.js';

// Імпорт Wizard-сцен
import { checkProductPriceScene } from './modules/check-price.js';
import { changeDollarScene } from './modules/change-dollar.js';

const CONFIG = parseJSON('CONFIG.json');
const BOT_TOKEN = CONFIG.bot_token;

const bot = new Telegraf(BOT_TOKEN);

bot.command('start', (ctx) => ctx.reply('Start'));

bot.command('help', (ctx) => ctx.reply('Help for using the system'));

const stage = new Scenes.Stage([
    checkProductPriceScene,
    changeDollarScene
]);

bot.use(session(), stage.middleware());

// Запуск сцени з цінами продукції Enzim Agro
bot.command('price', (ctx) => {
    ctx.scene.enter('checkProductPriceScene');
});

// Запуск сцени зміни курсу USD (лише для адміністраторів)
bot.command('change_dollar', async (ctx) => {
    const ADMINISTRATORS = getAdmins();
    if (ADMINISTRATORS.includes('@' + ctx.message.from.username)) {
        await ctx.scene.enter('changeDollarScene');
    }
});

// Отримання поточного курсу USD
bot.command('dollar_rate', async (ctx) => {
    const dollarRate = await parseJSON('src/json/dollar-rate.json').dollarRate;
    await ctx.reply(`Поточний курс USD: ${dollarRate} грн.`)
});

bot.launch();