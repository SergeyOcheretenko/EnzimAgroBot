'use strict';

import { Telegraf, session } from 'telegraf';
import CONFIG from '../CONFIG.json' assert { type: "json" };
import { sendHelp } from './modules/user-functionality.js';

const BOT_TOKEN = CONFIG.bot_token;

const bot = new Telegraf(BOT_TOKEN);

bot.command('start', (ctx) => {
    ctx.reply('Start');
});

bot.command('help', (ctx) => sendHelp(ctx));

bot.launch();