'use strict';

import { parseJSON } from "./work-with-json.js";

export function getAdmins() {
    return parseJSON('src/json/administrators.json').administrators;
}
