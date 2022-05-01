'use strict';

import { parseJSON, updateJSON } from "./work-with-json.js";
import { Scenes, Composer } from 'telegraf';

function checkIsNumber(text) {
    return /^[0-9]+$/.test(text);
}

const startChangeDollarScene = new Composer();
startChangeDollarScene.on('text', async (ctx) => {
    await ctx.reply('Введіть новий курс USD:');
    return ctx.wizard.next();
});

const changeDollarRate = new Composer();
changeDollarRate.on('text', async (ctx) => {
    const dollarRate = await ctx.message.text;
    if (checkIsNumber(dollarRate)) {
        updateJSON('src/json/dollar-rate.json', { dollarRate });
        ctx.reply('Значення змінено')
    } else {
        ctx.reply('Введено некоректне значення');
    }
    return ctx.scene.leave();
});

const changeDollarScene = new Scenes.WizardScene(
    'changeDollarScene', 
    startChangeDollarScene, 
    changeDollarRate
);

export { changeDollarScene };