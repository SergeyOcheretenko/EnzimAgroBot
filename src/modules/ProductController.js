'use strict';

import getXlsxData from "./parsers/parser.xlsx.js";

Array.prototype.removeDuplicate = function() {
    const arrayWithoutDuplicate = [];
    for (const elem of this) {
        if (!arrayWithoutDuplicate.includes(elem)) {
            arrayWithoutDuplicate.push(elem);
        }
    }
    return arrayWithoutDuplicate;
}

class ProductController {
    constructor() {
        this._xlsxData = getXlsxData();
    }

    renderData() {
        this._xlsxData = getXlsxData();
    }

    getTypeList() {
        this.renderData();
        return this._xlsxData
            .map(elem => elem.type)
            .removeDuplicate();
    }

    getProductList() {
        this.renderData();
        return this._xlsxData
            .map(elem => elem.productName)
            .removeDuplicate();
    }

    getProductsByType(type) {
        this.renderData();
        return this._xlsxData
            .filter(elem => elem.type === type)
            .map(elem => elem.productName)
            .removeDuplicate();
    }

    getPackagesByName(productName) {
        this.renderData();
        return this._xlsxData
            .filter(elem => elem.productName === productName)
            .map(elem => elem.packageType);
    }

    getPriceByNameAndPackage(productName, packageType) {
        this.renderData();
        return this._xlsxData.find(elem => 
            elem.productName === productName &&
            elem.packageType === packageType)
            .price;
    }

    getAllPackageVariants() {
        this.renderData();
        return this._xlsxData
            .map(elem => elem.packageType)
            .removeDuplicate();
    }
}

export default new ProductController();