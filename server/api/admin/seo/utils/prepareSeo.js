import pick from '@tinkoff/utils/object/pick';

const VALUES = ['name', 'metaTitle', 'metaDescription', 'metaKeywords'];

export default function prepareProduct (body) {
    return pick(VALUES, body);
}
