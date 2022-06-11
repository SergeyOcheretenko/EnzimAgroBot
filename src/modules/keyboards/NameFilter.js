'use strict';

class NameFilter {
    constructor (maxNameLength) {
        this.MAX_LENGTH = maxNameLength;
    }

    getShortNames(dataArray) {
        return dataArray.filter(elem => elem.length <= this.MAX_LENGTH);
    }

    getLongNames(dataArray) {
        return dataArray.filter(elem => elem.length > this.MAX_LENGTH);
    }
}

export default new NameFilter(20);