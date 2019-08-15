import trim from '@tinkoff/utils/string/trim';
import formatMoney from '../../client/utils/formatMoney';

export function getProductMetaTitleDefault (product) {
    const productName = trim(product.name);
    const productCompany = trim(product.company);

    return `${productCompany} ${productName}`;
}

export function getProductMetaDescriptionDefault (product) {
    const productName = trim(product.name);
    const productCompany = trim(product.company);

    return `Купите ${productName} от бренда ${productCompany} в интернет-магазине «Raze» по низкой цене - ${
        !product.discountPrice
            ? formatMoney(product.price)
            : formatMoney(product.discountPrice)}.`;
}

export function getProductKeywordsDefault (product, productCategoryName) {
    const productName = trim(product.name);
    const productCompany = trim(product.company);
    const productCategoryNameTrimmed = trim(productCategoryName);

    return `RAZE, ${productCategoryNameTrimmed}, ${productCompany}, ${productName}`;
}
