import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getProductsByIds from '../queries/getProductsByIds';
import editProduct from '../queries/editProduct';
import checkingRemainingTime from '../utils/checkingRemainingTime';

import reduce from '@tinkoff/utils/array/reduce';

export default function getAvailableProductsByIds (req, res) {
    const ids = req.body;

    getProductsByIds(ids)
        .then(products => {
            const availableProducts = products
                .filter(product => !product.hidden)
                .sort((prev, next) => next.date - prev.date);

            const checkingProductsDiscountTime = reduce((acc, product) => {
                if (product.discountTime && !checkingRemainingTime(product.discountTime).length) {
                    product.discountPrice = '';
                    product.discountTime = '';

                    editProduct(product);
                }

                return [...acc, product];
            }, [], availableProducts);

            res.status(OKEY_STATUS_CODE).send(checkingProductsDiscountTime);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
