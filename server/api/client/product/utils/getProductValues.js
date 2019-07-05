import pick from '@tinkoff/utils/object/pick';

const VALUES = [
    'name',
    'company',
    'price',
    'discountPrice',
    'description',
    'features',
    'categoryId',
    'tags',
    'notAvailable',
    'id',
    'date',
    'views',
    'avatar',
    'files',
    'tags',
    'filters',
    'rating'
];

export default function getProductValues (product) {
    return pick(VALUES, product);
}
