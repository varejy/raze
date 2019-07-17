import pick from '@tinkoff/utils/object/pick';

const VALUES = ['name', 'email', 'date', 'text', 'productId', 'verified', 'rating', 'id'];

export default function prepareComment (body) {
    return pick(VALUES, body);
}
