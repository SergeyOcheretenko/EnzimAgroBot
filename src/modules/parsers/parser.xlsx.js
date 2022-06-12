'use strict';

import xlsx from 'node-xlsx';

// *****************
// ДОПОМІЖНІ ФУНКЦІЇ
// *****************

// Видалення першого рядку XLSX-таблиці
function deleteXlsxTitle(xlsxData) {
    return xlsxData.slice(1,);
}

function createNameWithUnit(name, unit) {
    return `${name} (${unit.toLowerCase()})`;
}

// *******************************************
// ПАРСИНГ ТА ПОЕТАПНЕ ФОРМАТУВАННЯ XLSX-ДАНИХ
// *******************************************

// Отриманная матриці XLSX-таблиці
function parseNotformattedData() {
    try {
        const xlsxAllData = xlsx.parse('src/xlsx/price.xlsx')[0].data;
        return xlsxAllData.filter(row => row.length != 0);
    } catch (err) {
        console.log(err);
    }
}

function getXlsxData() {
    const xlsxData = deleteXlsxTitle(parseNotformattedData());
    const allProducts = [];

    let currentType = null;
    let currentProductName = null;

    for (const row of xlsxData) {
        if (row.length === 1) {
            currentType = row[0];
            continue;
        }

        const [productName, packageType, price, unit] = row;
        if (productName != null) currentProductName = productName;
        allProducts.push({ 
            type: currentType,
            productName: createNameWithUnit(currentProductName, unit),
            packageType,
            price
        });
    }
    return allProducts;
}

export default getXlsxData;