'use strict';

import { parseJSON } from "./work-with-json.js";

// Отримання списку адміністраторів
export function getAdmins() {
    return parseJSON('src/json/administrators.json').administrators;
}
