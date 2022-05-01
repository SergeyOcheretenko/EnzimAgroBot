'use strict';

import { Telegraf, Scenes, session } from 'telegraf';
import { parseJSON } from './modules/work-with-json.js';
import { checkProductPriceScene } from './modules/user-functionality.js';
import { getAdmins } from './modules/admins-list.js';
import { changeDollarScene } from './modules/change-dollar.js';

const CONFIG = parseJSON('CONFIG.json');
const BOT_TOKEN = CONFIG.bot_token;

const bot = new Telegraf(BOT_TOKEN);

bot.command('help', (ctx) => ctx.reply('Help for using the system'));

const stage = new Scenes.Stage([
    checkProductPriceScene,
    changeDollarScene
]);

bot.use(session(), stage.middleware());

bot.command('start', (ctx) => ctx.reply('Start'));

bot.command('price', (ctx) => {
    ctx.scene.enter('checkProductPriceScene');
});

bot.command('change_dollar', async (ctx) => {
    const ADMINISTRATORS = getAdmins();
    if (ADMINISTRATORS.includes('@' + ctx.message.from.username)) {
        await ctx.scene.enter('changeDollarScene');
    }
});

bot.launch();