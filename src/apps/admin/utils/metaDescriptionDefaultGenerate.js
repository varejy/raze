import trim from '@tinkoff/utils/string/trim';
import formatMoney from '../../client/utils/formatMoney';

export default function metaDescriptionDefaultGenerate (option, object) {
    const categoryName = trim(option === 'category' ? object.name : '');
    const productName = trim(option === 'product' ? object.name : '');
    const productCompany = trim(option === 'product' ? object.company : '');

    return option === 'product'
        ? `Купите ${productName} от бренда ${productCompany} в интернет-магазине «Raze» по низкой цене - ${
            !object.discountPrice
                ? formatMoney(object.price)
                : formatMoney(object.discountPrice)}.`
        : `Купите ${categoryName.toLowerCase()} в интернет-магазине «Raze». Качественные ${
            categoryName.toLowerCase()} от лучших брендов в Украине по низким ценам.`;
}
