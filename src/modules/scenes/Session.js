'use strict';

class Session {
    constructor() {
        this._type = null;
        this._productName = null;
    }

    get type() {
        return this._type;
    }

    set type(productType) {
        this._type = productType;
    }

    get productName() {
        return this._productName;
    }

    set productName(name) {
        this._productName = name;
    }
}

export default new Session();