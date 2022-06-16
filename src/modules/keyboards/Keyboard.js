'use strict';

import { Markup } from "telegraf";
import Buttons from "./Buttons.js";

class Keyboard {
    createKeyboard(dataArray, params = { backButton: false, oneColumn: false }) {
        const buttons = Buttons.createButtons(dataArray, params);
        return Markup.inlineKeyboard(buttons); 
    }
}

export default new Keyboard();