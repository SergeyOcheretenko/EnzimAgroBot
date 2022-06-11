'use strict';

import getXlsxData from "./parsers/parser.xlsx.js";

class ProductController {
    constructor() {
        this._xlsxData = getXlsxData();
    }

    renderData() {
        this._xlsxData = getXlsxData();
    }

    getTypeList() {
        this.renderData();
        return Object.keys(this._xlsxData);
    }

    getProductsByType(type) {
        this.renderData();
        const products = this._xlsxData[type];
        return products.map(elem => elem.name);
    }

    getAllProductsWithPrices() {
        const productsWithPrices = {};
        for (const type in this._xlsxData) {
            const products = this._xlsxData[type];
            for (const product of products) {
                const { name, sales } = product;
                const pricesByPackage = {};
                sales.forEach(sale => {
                    pricesByPackage[sale.packageType] = sale.price;
                });
                productsWithPrices[name] = pricesByPackage;
            }
        }
        return productsWithPrices;
    }

    getAllPackageVariants() {
        const packages = [];
        const products = this.getAllProductsWithPrices();
        for (const productName in products) {
            const product = products[productName];
            for (const packageType in product) {
                if (!packages.includes(packageType)) {
                    packages.push(packageType);
                }
            }
        }
        return packages;
    }
}

export default new ProductController();