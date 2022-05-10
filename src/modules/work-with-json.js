'use strict';

import fs from 'fs';

// Зчитування даних з JSON-файла по заданому шляху
function parseJSON(path) {
    const data = JSON.parse(fs.readFileSync(path));
    return data;
}

// Переписування даних у заданому файлі JSON
function updateJSON(path, data) {
    const formattedData = JSON.stringify(data);
    fs.writeFileSync(path, formattedData);
    return;
}

export { parseJSON, updateJSON };