'use strict';

import { parseJSON } from "./parsers/parser.json.js";

// Отримання списку адміністраторів
export default function getAdmins() {
    return parseJSON('src/json/administrators.json').administrators;
}
