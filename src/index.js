'use strict';

import { Telegraf, Composer, Markup, Scenes, session } from 'telegraf';
import CONFIG from '../CONFIG.json' assert { type: "json" }; 

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