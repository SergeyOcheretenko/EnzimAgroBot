'use strict';

import { Scenes } from 'telegraf';

function sendHelp(ctx) {
    ctx.reply('Help for using the system');
}

export { sendHelp };