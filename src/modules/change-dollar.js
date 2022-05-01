'use strict';

import { parseJSON, updateJSON } from "./work-with-json.js";
import { Scenes, Composer } from 'telegraf';

function checkIsNumber(str) {
    return (!isNaN(str) && !isNaN(parseFloat(str)));
}

const startChangeDollarScene = new Composer();
startChangeDollarScene.on('text', async (ctx) => {
    await ctx.reply('Введіть новий курс USD:');
    return ctx.wizard.next();
});

const changeDollarRate = new Composer();
changeDollarRate.on('text', async (ctx) => {
    const dollarRate = await ctx.message.text.replace(',', '.');
    if (checkIsNumber(dollarRate)) {
        await updateJSON('src/json/dollar-rate.json', { dollarRate });
        await ctx.reply('Значення змінено')
    } else {
        await ctx.reply('Введено некоректне значення');
    }
    return ctx.scene.leave();
});

const changeDollarScene = new Scenes.WizardScene(
    'changeDollarScene', 
    startChangeDollarScene, 
    changeDollarRate
);

export { changeDollarScene };