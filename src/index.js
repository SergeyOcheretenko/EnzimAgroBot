'use strict';

import { Telegraf, Scenes, session } from 'telegraf';
import CONFIG from '../CONFIG.json' assert { type: "json" };
import { checkProductPriceScene } from './modules/user-functionality.js';

const BOT_TOKEN = CONFIG.bot_token;

const bot = new Telegraf(BOT_TOKEN);

bot.command('help', (ctx) => ctx.reply('Help for using the system'));

const stage = new Scenes.Stage([checkProductPriceScene]);
bot.use(session(), stage.middleware());

bot.command('start', (ctx) => {
    ctx.scene.enter('checkProductPriceScene');
});

bot.launch();