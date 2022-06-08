'use strict';

import fs from 'fs';

// Зчитування даних з TXT-файла по заданому шляху
function parseTXT(path) {
    const data = fs.readFileSync(path);
    return data.toString().replace('\n', '');
}

export default parseTXT;