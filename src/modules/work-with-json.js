'use strict';

import fs from 'fs';

function parseJSON(path) {
    const data = JSON.parse(fs.readFileSync(path));
    return data;
}

function updateJSON(path, data) {
    const formattedData = JSON.stringify(data);
    fs.writeFileSync(path, formattedData);
    return;
}

export { parseJSON, updateJSON };