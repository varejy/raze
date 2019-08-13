import pick from '@tinkoff/utils/object/pick';

const VALUES = [
    'name',
    'company',
    'price',
    'discountPrice',
    'discountTime',
    'description',
    'features',
    'filters',
    'categoryId',
    'tags',
    'hidden',
    'notAvailable',
    'id',
    'metaTitle',
    'keywords',
    'metaDescription'
];

export default function prepareProduct (body) {
    return pick(VALUES, body);
}
