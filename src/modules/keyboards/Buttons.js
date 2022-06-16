'use strict';

import { Markup } from 'telegraf';
import NameFilter from './NameFilter.js';

class Buttons {
    createButton(elem) {
        return Markup.button.callback(elem, elem);
    }

    createButtonsOneColumn(dataArray) {
        return dataArray.map(elem => [ this.createButton(elem) ]);
    }

    createButtonsTwoColumn(dataArray) {
        const len = dataArray.length;
        if (len === 1) {
            return this.createButtonsOneColumn(dataArray);
        }

        const buttons = [];
        for (let i = 1; i < len; i += 2) {
            const firstElem = dataArray[i - 1];
            const secondElem = dataArray[i];
            buttons.push([ this.createButton(firstElem), this.createButton(secondElem) ]);
        }
    
        if (len % 2 !== 0) {
            const lastElem = dataArray[len - 1];
            buttons.push([ this.createButton(lastElem) ]);
        }
    
        return buttons;
    }

    createStandardButtons(dataArray) {
        const shortNames = NameFilter.getShortNames(dataArray);
        const longNames = NameFilter.getLongNames(dataArray);
    
        const shortButtons = this.createButtonsTwoColumn(shortNames);
        const longButtons = this.createButtonsOneColumn(longNames);
        
        const allButtons = shortButtons.concat(longButtons);
        return allButtons;
    }

    createButtons(dataArray, params = { backButton: false, oneColumn: false }) {
        const buttons = params.oneColumn ? 
            this.createButtonsOneColumn(dataArray) :
            this.createStandardButtons(dataArray);

        if (params.backButton) buttons.push([ this.createButton('Назад') ]);
        return buttons; 
    }
}

export default new Buttons();