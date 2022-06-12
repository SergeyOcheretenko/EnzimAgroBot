'use strict';

import fs from 'fs';

// Зчитування даних з TXT-файла по заданому шляху
function parseTXT(path) {
    try {
        const data = fs.readFileSync(path);
        return data.toString().replace('\n', '');
    } catch(err) {
        console.log(err);
    }
}

export default parseTXT;