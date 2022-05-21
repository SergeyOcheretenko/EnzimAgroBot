'use strict';

// Імпорт бібліотеки для зчитування XLSX-даних
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
    const xlsxAllData = xlsx.parse('src/xlsx/price.xlsx')[0].data;

    return xlsxAllData.filter(row => row.length != 0);
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

// Перевірка наявності типів пакувань "кг", "л" та "пак"
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

// Функція, що повертая масив варіантів продажу лише в обраній одиниці вимірювання
function filterByUnit(saleArray, unit) {
    return saleArray.filter(saleVariant => saleVariant.unit === unit);
}

// Форматування даних для розподілення сухої та рідкої продукції
function formatProductsList(productsArray) {
    const newProductsList = [];

    for (const productObject of productsArray) {
        const unitsExisting = checkUnits(productObject.sale);

        for (const unit in unitsExisting) {
            if (unitsExisting[unit]) {
                newProductsList.push({
                    name: productObject.name + ` (${unit})`,
                    sale: filterByUnit(productObject.sale, unit)
                });
            }
        }
    }

    return newProductsList;
}

// Зчитування XLSX-даних з повним форматуванням даних
function getXlsxData() {
    const xlsxData = getDataWithoutUnitFormat();

    xlsxData.forEach(productsByTypeObject => productsByTypeObject.products = formatProductsList(productsByTypeObject.products));

    return xlsxData;
}

// Отримання категорій продуктів Enzim Agro з отриманих XLSX-даних
function getTypesList() {
    const xlsxData = getXlsxData();
    const types = [];
    for (const productTypeObject of xlsxData) {
        types.push(productTypeObject.productType);
    }
    return types;
}

// Отримання об'єкту "продукт: ціна"
function getProductsWithPrices() {
    const allProductsWithPrices = {};
    const xlsxData = getXlsxData();
    for (const objectByType of xlsxData) {
        const products = objectByType.products;

        for (const productObject of products) {
            const productName = productObject.name;
            const productSaleVariants = productObject.sale;
            const productPricesByPackageType = {};
            
            for (const saleVariant of productSaleVariants) {
                const packageType = saleVariant.packageType;
                const price = saleVariant.price;
                productPricesByPackageType[packageType] = price;
            }
            allProductsWithPrices[productName] = productPricesByPackageType;
        }
    }
    return allProductsWithPrices;
}

function getAllPackageVariants() {
    const packageVariants = [];
    
    const productsWithPrices = getProductsWithPrices();
    for (const productName in productsWithPrices) {
        for (const packageType in productsWithPrices[productName]) {
            if (!packageVariants.includes(packageType)) {
                packageVariants.push(packageType);
            }
        }
    }
    return packageVariants;
}

export { getXlsxData, getTypesList, getProductsWithPrices, getAllPackageVariants };