import trim from '@tinkoff/utils/string/trim';

export function getCategoryMetaTitleDefault (category) {
    const categoryName = trim(category.name);

    return `${categoryName}`;
}

export function getCategoryMetaDescriptionDefault (category) {
    const categoryName = trim(category.name);

    return `Купите ${categoryName.toLowerCase()} в интернет-магазине «Raze». Качественные ${
        categoryName.toLowerCase()} от лучших брендов в Украине по низким ценам.`;
}

export function getCategoryKeywordsDefault (category) {
    const categoryName = trim(category.name);

    return `RAZE, ${categoryName}`;
}
