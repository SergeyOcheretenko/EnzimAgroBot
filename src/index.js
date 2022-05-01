'use strict';

import { Telegraf, Composer, Markup, Scenes, session } from 'telegraf';
import CONFIG from '../CONFIG.json' assert { type: "json" }; 

const BOT_TOKEN = CONFIG.bot_token;

const bot = new Telegraf(BOT_TOKEN);

const productTypesKeyboard = Markup.inlineKeyboard([
    [
        Markup.button.callback('Інсектициди', 'Insecticides'),
        Markup.button.callback('Фунгіциди', 'Fungicides')
    ],
    [
        Markup.button.callback('Complex additives', 'ComplexAdditives'),
        Markup.button.callback('Інокулянти', 'Annoculants')
    ],
    [
        Markup.button.callback('Стимулятори росту', 'GrowthStimulators'),
        Markup.button.callback('Покращувачі грунту', 'SoilImprovers')
    ],
    [
        Markup.button.callback('Відміна', 'Cancel')
    ]
]);

function sendHelp(ctx) {
    ctx.reply('Help for using the system');
}

bot.command('start', (ctx) => {
    ctx.reply('Start');
});

bot.command('help', (ctx) => sendHelp(ctx));

bot.launch();