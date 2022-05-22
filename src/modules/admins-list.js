'use strict';

import { parseJSON } from "./work-with-json.js";

// Отримання списку адміністраторів
export default function getAdmins() {
    return parseJSON('src/json/administrators.json').administrators;
}
