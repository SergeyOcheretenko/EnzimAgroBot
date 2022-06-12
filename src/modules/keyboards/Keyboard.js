'use strict';

import { Markup } from "telegraf";
import getXlsxData from "../parsers/parser.xlsx.js";
import Buttons from "./Buttons.js";

class Keyboard {
    createKeyboard(dataArray, params = { backButton: false, oneColumn: false }) {
        const buttons = Buttons.createButtons(dataArray, params);
        return Markup.inlineKeyboard(buttons); 
    }

    createProductsKeyboards() {
        const xlsxData = getXlsxData();
        const typesList = Object.keys(xlsxData);
        const keyboardsByTypes = {};
    
        for (const type of typesList) {
            const products = xlsxData[type];
            const productsNames = products.map(elem => elem.name);
            keyboardsByTypes[type] = this.createKeyboard(productsNames, { backButton: true });
        }
    
        return keyboardsByTypes;
    }
}

export default new Keyboard();