'use strict';

import xlsx from 'node-xlsx';
import ErrorLogger from '../ErrorLogger.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

class ParserXLSX {
    constructor(path) {
        this._path = path;
    }
    deleteXlsxTitle(xlsxData) {
        return xlsxData.slice(1,);
    }

    parseUnformattedData() {
        try {
            const parsedData = xlsx.parse(this._path)[0].data;
            const dataWithoutEmptyLines = parsedData.filter(row => row.length != 0);
            return this.deleteXlsxTitle(dataWithoutEmptyLines);
        } catch (err) {
            ErrorLogger.saveError(err, __filename);
            return [];
        }
    }

    getXlsxData() {
        try {
            const xlsxData = this.parseUnformattedData();
            const allProducts = [];
            for (const row of xlsxData) {
                const [productName, unit, packageType, type, price] = row;
                allProducts.push({ 
                    type,
                    productName,
                    packageType,
                    price
                });
            }
            return allProducts;
        } catch (err) {
            ErrorLogger.saveError(err, __filename);
            return [];
        }
    }
}

export default new ParserXLSX('/home/ocheretenko/Downloads/priceagro.xlsx');