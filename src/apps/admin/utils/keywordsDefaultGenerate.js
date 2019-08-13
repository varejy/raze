import trim from '@tinkoff/utils/string/trim';

export default function metaTitleDefaultGenerate (option, object, productCategoryName) {
    const categoryName = trim(option === 'category' ? object.name : '');
    const productName = trim(option === 'product' ? object.name : '');
    const productCompany = trim(option === 'product' ? object.company : '');
    const productCategoryNameTrimmed = trim(option === 'product' ? productCategoryName : '');

    return option === 'product' ? `RAZE, ${productCategoryNameTrimmed}, ${productCompany}, ${productName}` : `RAZE, ${categoryName}`;
}
