'use strict';

import { Scenes, Composer, session } from 'telegraf';

import { createKeyboardInOneColumn } from '../keyboards.js';
import getAdmins from '../admins-list.js';
import { parseJSON, updateJSON } from '../work-with-json.js';

// Перевірка чи є рядок числом
function checkIsNumber(str) {
    return (!isNaN(str) && !isNaN(parseFloat(str)));
}

// Повернення курсу USD з файлу JSON
function checkDollarRate() {
    const dollarJsonObject = parseJSON('src/json/dollar-rate.json');
    return dollarJsonObject.dollarRate;
}

const sendFunctionality = new Composer();
sendFunctionality.on('text', async (ctx) => {
    const ADMINISTRATORS = getAdmins();
    const currentUser = '@' + ctx.message.from.username;

    if (!ADMINISTRATORS.includes(currentUser)) {
        await ctx.reply('Ви не є адміністратором.');
        return ctx.scene.leave();
    }

    await ctx.reply(
        'Оберіть дію:', 
        createKeyboardInOneColumn(['❓ Поточний курс USD', '💰 Змінити курс USD'])
    );

    return ctx.wizard.next();
});

const selectFunction = new Composer();
selectFunction.action('❓ Поточний курс USD', async (ctx) => {
    await ctx.replyWithHTML(`Поточний курс USD: <b>${checkDollarRate()} грн.</b>`)
    return ctx.scene.leave();
});

selectFunction.action('💰 Змінити курс USD', async (ctx) => {
    await ctx.reply('Введіть новий курс USD:');
    return ctx.wizard.next();
});

// Перевірка введених даних на коректність та зміна поточного курсу USD
const changeDollarRate = new Composer();
changeDollarRate.on('text', async (ctx) => {
    const dollarRate = await ctx.message.text.replace(/,/g, '.');
    if (!checkIsNumber(dollarRate)) {
        await ctx.reply('Введено некоректне значення');
        return ctx.scene.leave();
    }
    await updateJSON('src/json/dollar-rate.json', { dollarRate });
    await ctx.replyWithHTML(
        `<b>Значення змінено.</b>\n\nПоточний курс USD: <b>${checkDollarRate()} грн.</b>`
    );
    
    return ctx.scene.leave();
});

const dollarScene = new Scenes.WizardScene(
    'dollarScene', 
    sendFunctionality, 
    selectFunction,
    changeDollarRate
);

export { dollarScene, checkDollarRate };
