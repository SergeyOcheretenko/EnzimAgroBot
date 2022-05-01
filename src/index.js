'use strict';

import { Telegraf, Composer, Markup, Scenes, session } from 'telegraf';
import CONFIG from '../CONFIG.json' assert { type: "json" }; 

const BOT_TOKEN = CONFIG.bot_token;

const bot = new Telegraf(BOT_TOKEN);

bot.command('start', (ctx) => {
    ctx.reply('Start');
});

bot.launch();