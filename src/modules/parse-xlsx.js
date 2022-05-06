'use strict';

import xlsx from 'node-xlsx';

// Отримання "довжини" об'єкту
function getObjectLength(object) {
    return Object.keys(object).length;
}

// Видалення першого рядку XLSX-таблиці
function deleteXlsxTitle(xlsxData) {
    return xlsxData.slice(1,);
}

// Отриманная матриці XLSX-таблиці
function getNotformattedData() {
    return xlsx.parse('../xlsx/price.xlsx')[0].data;
}

//Форматування та конвертування у формат hash-table отриманих XLSX-даних
function getDataWithoutUnitFormat() {
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
    typeAndProducts.products = products;
    sortByTypeArray.push(typeAndProducts);
    return sortByTypeArray;
}

function checkUnits(saleArray) {
    const unitsExisting = {
        'кг': false,
        'л': false,
        'пак': false
    };
    for (const saleVariant of saleArray) {
        const currentVariantUnit = saleVariant.unit.toLowerCase();
        unitsExisting[currentVariantUnit] = true;
    }
    return unitsExisting;
}

function formatProductsList(productsArray) {
    const newProductsList = [...productsArray];

    for (const productObject of productsArray) {
        const unitsExisting = checkUnits(productObject.sale);
        
        const haveKg = unitsExisting['кг'];
        const haveL = unitsExisting['л'];
        const havePak = unitsExisting['пак'];

        // if (haveKg) {
        //     const newKgProduct = {
        //         name: productObject.name + ' (кг)',
        //         sale
        //     }
        // }
    }
}

// Форматування даних для розподілення сухої та рідкої продукції
function getXlsxData() {
    const xlsxData = getDataWithoutUnitFormat();

}

for (const object of getDataWithoutUnitFormat()) {
    const products = object.products;
    const type = object.productType;
    console.dir({ type, products });
}

for (const object of getXlsxData()) {
    const products = object.products;
    const type = object.productType;
    console.dir({ type, products });
}

export { getXlsxData };