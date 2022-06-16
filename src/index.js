'use strict';

import { Telegraf, Scenes, session } from 'telegraf';
import config from '../CONFIG.js'
import createCheckPriceScene from './modules/scenes/scene.price.js';

const bot = new Telegraf(config.BOT_TOKEN);

let checkPriceScene = createCheckPriceScene();

const stage = new Scenes.Stage([
    checkPriceScene
]);

function startPriceScene(ctx) {
    checkPriceScene = createCheckPriceScene();
    ctx.scene.enter('checkPriceScene');
}

bot.use(session(), stage.middleware());

bot.command('start', (ctx) => {
    startPriceScene(ctx);
});

bot.command('price', (ctx) => {
    startPriceScene(ctx);
});

bot.command('help', (ctx) => {
    ctx.reply('Щоб дізнатися ціну продукції, запустіть команду /price');
});

bot.launch();