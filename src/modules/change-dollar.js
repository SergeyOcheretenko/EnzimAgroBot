'use strict';

import { parseJSON, updateJSON } from "./work-with-json.js";
import { Scenes, Composer } from 'telegraf';

// Перевірка чи є рядок потенційним числом
function checkIsNumber(str) {
    return (!isNaN(str) && !isNaN(parseFloat(str)));
}

// Початок сцени зміни курсу USD. Створення запиту на новий курс
const startChangeDollarScene = new Composer();
startChangeDollarScene.on('text', async (ctx) => {
    await ctx.reply('Введіть новий курс USD:');
    return ctx.wizard.next();
});

// Перевірка введених даних на коректність та зміна поточного курсу USD
const changeDollarRate = new Composer();
changeDollarRate.on('text', async (ctx) => {
    const dollarRate = await ctx.message.text.replace(',', '.');
    if (checkIsNumber(dollarRate)) {
        await updateJSON('src/json/dollar-rate.json', { dollarRate });
        const updatedDollarRate = await parseJSON('src/json/dollar-rate.json').dollarRate;
        await ctx.reply(`Значення змінено.\n\nПоточний курс USD: ${updatedDollarRate} грн.`)
    } else {
        await ctx.reply('Введено некоректне значення');
    }
    return ctx.scene.leave();
});

// Створення повної сцени
const changeDollarScene = new Scenes.WizardScene(
    'changeDollarScene', 
    startChangeDollarScene, 
    changeDollarRate
);

export { changeDollarScene };