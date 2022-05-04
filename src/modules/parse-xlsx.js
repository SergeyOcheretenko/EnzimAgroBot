'use strict';

import xlsx from 'node-xlsx';
import fs from 'fs';

function getObjectLength(object) {
    return Object.keys(object).length;
}

function deleteXlsxTitle(xlsxData) {
    return xlsxData.slice(1,);
}

function getNotformattedData() {
    return xlsx.parse('src/xlsx/price.xlsx')[0].data;
}

export function getXlsxData() {
    const xlsxData = deleteXlsxTitle(getNotformattedData());

    const sortByTypeArray = [];
    let typeAndProducts = {};
    let products = [];

    for (const row of xlsxData) {
        if (row.length === 1) {
            if (getObjectLength(typeAndProducts) !== 0) {
                typeAndProducts.products = products;
                sortByTypeArray.push(typeAndProducts);
                typeAndProducts = {};
                products = [];
            }

            typeAndProducts.productType = row[0];
        } else {
            const [productName, packageType, price, unit] = row;

            if (productName != null) {
                const product = {
                    name: productName,
                    sale: [{ packageType, price, unit }]
                };

                products.push(product);
            } else {
                products[products.length - 1].sale.push({ packageType, price, unit });
            }
        }
    }

    return sortByTypeArray;
}