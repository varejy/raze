import pick from '@tinkoff/utils/object/pick';

const VALUES = ['name', 'comment', 'date', 'status', 'department', 'city', 'paymentType', 'orderType', 'phone', 'id'];

export default function prepareOrder (body) {
    return pick(VALUES, body);
}
