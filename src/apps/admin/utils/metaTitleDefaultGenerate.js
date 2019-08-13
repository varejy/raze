import trim from '@tinkoff/utils/string/trim';

export default function metaTitleDefaultGenerate (option, object) {
    const categoryName = trim(option === 'category' ? object.name : '');
    const productName = trim(option === 'product' ? object.name : '');
    const productCompany = trim(option === 'product' ? object.company : '');

    return option === 'product' ? `${productCompany} ${productName}` : `${categoryName}`;
}
