'use strict';

import { Telegraf, Composer, Scenes, session } from 'telegraf';
import CONFIG from '../CONFIG.json' assert { type: "json" }; 
import * as keyboards from './modules/keyboards.js';

const BOT_TOKEN = CONFIG.bot_token;

const bot = new Telegraf(BOT_TOKEN);

function sendHelp(ctx) {
    ctx.reply('Help for using the system');
}

bot.command('start', (ctx) => {
    ctx.reply('Start');
});

bot.command('help', (ctx) => sendHelp(ctx));

bot.launch();