'use strict';

import { Telegraf, Scenes, session } from 'telegraf';
import { parseJSON } from './modules/work-with-json.js';
import { checkProductPriceScene } from './modules/user-functionality.js';

const CONFIG = parseJSON('CONFIG.json');
const BOT_TOKEN = CONFIG.bot_token;

const bot = new Telegraf(BOT_TOKEN);

bot.command('help', (ctx) => ctx.reply('Help for using the system'));

const stage = new Scenes.Stage([checkProductPriceScene]);
bot.use(session(), stage.middleware());

bot.command('start', (ctx) => {
    ctx.scene.enter('checkProductPriceScene');
});

bot.launch();