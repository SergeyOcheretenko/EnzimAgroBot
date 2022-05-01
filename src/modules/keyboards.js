'use strict';

import { Markup } from 'telegraf';

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

export { productTypesKeyboard };