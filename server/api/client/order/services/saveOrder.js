import uniqid from 'uniqid';
import saveOrderQuery from '../queries/saveOrder';
import isString from '@tinkoff/utils/is/string';
import isEmpty from '@tinkoff/utils/is/empty';
import cond from '@tinkoff/utils/function/cond';
import includes from '@tinkoff/utils/array/includes';
import T from '@tinkoff/utils/function/T';
import F from '@tinkoff/utils/function/F';
import append from '@tinkoff/utils/array/append';
import reduce from '@tinkoff/utils/array/reduce';
import find from '@tinkoff/utils/array/find';

import getProductsByIds from '../../product/queries/getProductsByIds';

import getSavedProductsQuery from '../../savedProducts/queries/getSavedProducts';

import { NOT_FOUND_STATUS_CODE, OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

const MAX_NAME_LENGTH = 200;
const MAX_PHONE_LENGTH = 100;
const MAX_CITY_LENGTH = 100;
const MAX_DEPARTMENT_LENGTH = 100;
const ORDER_TYPES = ['nova', 'ukr'];
const PAYMENT_TYPES = ['cod', 'card'];

const validateOrder = cond([
    [({ name }) => !isString(name) || isEmpty(name) || name.length > MAX_NAME_LENGTH, F],
    [({ phone }) => !isString(phone) || isEmpty(phone) || phone.length > MAX_PHONE_LENGTH, F],
    [({ city }) => !isString(city) || isEmpty(city) || city.length > MAX_CITY_LENGTH, F],
    [({ department }) => !isString(department) || isEmpty(department) || department.length > MAX_DEPARTMENT_LENGTH, F],
    [({ orderType }) => !includes(orderType, ORDER_TYPES), F],
    [({ paymentType }) => !includes(paymentType, PAYMENT_TYPES), F],
    [T, T]
]);

export default function saveOrder (req, res) {
    const { name, phone, orderType, paymentType, department, city } = req.body;
    const { id } = req.query;

    getSavedProductsQuery(id)
        .then(([savedProducts]) => {
            if (!savedProducts) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            const { basket } = savedProducts;

            getProductsByIds(basket.map(basket => basket.id))
                .then((baskedProducts) => {
                    const products = reduce((products, { id, count }) => {
                        const product = find(product => product.id === id, baskedProducts);

                        return !product || product.hidden ? products : append({ product, count }, products);
                    }, [], basket);

                    const orderProductsMap = products.map(elem => {
                        const { product } = elem;
                        return {
                            id: product.id,
                            name: product.name,
                            count: elem.count,
                            price: product.price
                        };
                    });

                    const order = {
                        id: uniqid(),
                        date: Date.now(),
                        name,
                        phone,
                        orderType,
                        paymentType,
                        city,
                        products: orderProductsMap,
                        comment: '',
                        status: 'new',
                        department
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
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
