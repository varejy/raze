import pick from '@tinkoff/utils/object/pick';

const VALUES = ['name', 'company', 'price', 'discountPrice', 'description', 'features', 'filters', 'categoryId', 'tags', 'hidden', 'notAvailable', 'id',
    'metaTitle', 'metaDescription', 'metaKeywords'];

export default function prepareProduct (body) {
    return pick(VALUES, body);
}
