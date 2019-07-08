import uniqid from 'uniqid';
import saveOrderQuery from '../queries/saveOrder';
import isString from '@tinkoff/utils/is/string';
import isEmpty from '@tinkoff/utils/is/empty';
import cond from '@tinkoff/utils/function/cond';
import includes from '@tinkoff/utils/array/includes';
import T from '@tinkoff/utils/function/T';
import F from '@tinkoff/utils/function/F';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

const MAX_NAME_LENGTH = 200;
const MAX_PHONE_LENGTH = 100;
const ORDER_TYPES = ['nova', 'ukr'];
const PAYMENT_TYPES = ['cod', 'card'];

const validateOrder = cond([
    [({ name }) => !isString(name) || isEmpty(name) || name.length > MAX_NAME_LENGTH, F],
    [({ phone }) => !isString(phone) || isEmpty(phone) || phone.length > MAX_PHONE_LENGTH, F],
    [({ orderType }) => !includes(orderType, ORDER_TYPES), F],
    [({ paymentType }) => !includes(paymentType, PAYMENT_TYPES), F],
    [T, T]
]);

export default function saveOrder (req, res) {
    const { name, phone, orderType, paymentType } = req.body;
    const order = {
        id: uniqid(),
        date: Date.now(),
        name,
        phone,
        orderType,
        paymentType
    };

    const isValid = validateOrder(order);

    if (!isValid) {
        return res.status(FORBIDDEN_STATUS_CODE).end();
    }

    saveOrderQuery(order)
        .then(() => {
            res.status(OKEY_STATUS_CODE).end();
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
