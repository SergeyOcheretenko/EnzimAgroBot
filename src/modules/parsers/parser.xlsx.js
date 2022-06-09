'use strict';

import xlsx from 'node-xlsx';

// *****************
// ДОПОМІЖНІ ФУНКЦІЇ
// *****************

// Видалення першого рядку XLSX-таблиці
function deleteXlsxTitle(xlsxData) {
    return xlsxData.slice(1,);
}

// Перевірка наявності типів пакувань "кг", "л" та "пак"
function checkUnits(sales) {
    const unitsExisting = {
        'кг': false,
        'л': false,
        'пак': false
    };
    for (const saleVariant of sales) {
        const unit = saleVariant.unit.toLowerCase();
        unitsExisting[unit] = true;
    }
    return unitsExisting;
}

// Функція, що повертая масив варіантів продажу лише в обраній одиниці вимірювання
function filterByUnit(sales, unit) {
    return sales.filter(saleVariant => saleVariant.unit === unit);
}

// *******************************************
// ПАРСИНГ ТА ПОЕТАПНЕ ФОРМАТУВАННЯ XLSX-ДАНИХ
// *******************************************

// Отриманная матриці XLSX-таблиці
function parseNotformattedData() {
    const xlsxAllData = xlsx.parse('src/xlsx/price.xlsx')[0].data;
    return xlsxAllData.filter(row => row.length != 0);
}

// Форматування та конвертування у формат hash-table отриманих XLSX-даних
function getDataWithoutUnitFormat() {
    const xlsxData = deleteXlsxTitle(parseNotformattedData());
    const resultData = {};

    let products = [];
    let currentType = null;

    for (const row of xlsxData) {
        if (row.length === 1) {
            if (products.length !== 0) {
                resultData[currentType] = products;
                products = [];
            }
            currentType = row[0];
        } else {
            const [name, packageType, price, unit] = row;
            if (name != null) {
                const product = {
                    name: name,
                    sales: [{ packageType, price, unit }]
                };
                products.push(product);
            } else {
                products[products.length - 1].sales.push({ packageType, price, unit });
            }
        }
    }
    resultData[currentType] = products;
    return resultData;
}

// Форматування даних для розподілення сухої та рідкої продукції
function formatByUnits(products) {
    const newProducts = [];

    for (const product of products) {
        const unitsExisting = checkUnits(product.sales);

        for (const unit in unitsExisting) {
            if (unitsExisting[unit]) {
                newProducts.push({
                    name: product.name + ` (${unit})`,
                    sales: filterByUnit(product.sales, unit)
                });
            }
        }
    }
    return newProducts;
}

// Зчитування XLSX-даних з повним форматуванням даних
function getXlsxData() {
    const xlsxData = getDataWithoutUnitFormat();
    for (const type in xlsxData) {
        const products = xlsxData[type];
        xlsxData[type] = formatByUnits(products);
    }
    return xlsxData;
}

// *****************
// ДОДАТКОВІ ФУНКЦІЇ
// *****************

// Отримання категорій продуктів Enzim Agro з отриманих XLSX-даних
function getTypesList() {
    const xlsxData = getXlsxData();
    return Object.keys(xlsxData);
}

// Отримання об'єкту "продукт: упаковка: ціна"
function getProductsWithPrices() {
    const allProductsWithPrices = {};
    const xlsxData = getXlsxData();
    for (const type in xlsxData) {
        const products = xlsxData[type];

        for (const product of products) {
            const productName = product.name;
            const sales = productObject.sales;
            const pricesByPackage = {};
            
            for (const saleVariant of sales) {
                const packageType = saleVariant.packageType;
                const price = saleVariant.price;
                pricesByPackage[packageType] = price;
            }
            allProductsWithPrices[productName] = pricesByPackage;
        }
    }
    return allProductsWithPrices;
}

// Отримання усіх існуючих варіантів пакувань
function getAllPackageVariants() {
    const packages = [];
    
    const products = getProductsWithPrices();
    for (const productName in products) {
        for (const packageType in products[productName]) {
            if (!packages.includes(packageType)) {
                packages.push(packageType);
            }
        }
    }
    return packages;
}

export { 
    getXlsxData, 
    getTypesList, 
    getProductsWithPrices, 
    getAllPackageVariants 
};