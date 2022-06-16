'use strict';

import fs from 'fs';

class ErrorLogger {
    constructor(path) {
        this._path = path;
    }

    saveError(err, location) {
        const locationText = `Error in location: ${location}.\n`;
        const errorText = err.toString() + '\n\n';
        fs.appendFile(this._path, locationText + errorText, (error) => {
            if (error) {
                console.log(error);
            }
        });
    }
}

export default new ErrorLogger('logs/errors.log.txt');