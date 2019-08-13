import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getCategoriesByPath from '../../category/queries/getCategoriesByPath';
import getProductsByCategoryId from '../queries/getProductsByCategoryId';
import editProduct from '../queries/editProduct';
import getRemainingTime from '../utils/getRemainingTime';

import reduce from '@tinkoff/utils/array/reduce';
import noop from '@tinkoff/utils/function/noop';

export default function getAvailableProductsByCategory (req, res) {
    const { name } = req.query;

    getCategoriesByPath(name)
        .then(([category]) => {
            getProductsByCategoryId(category.id)
                .then(products => {
                    const availableProducts = products
                        .filter(product => !product.hidden)
                        .sort((prev, next) => next.date - prev.date);

                    const checkingProductsDiscountTime = reduce((acc, product) => {
                        if (product.discountTime && !getRemainingTime(product.discountTime).length) {
                            product.discountPrice = '';
                            product.discountTime = '';

                            editProduct(product)
                                .then(noop);
                        }

                        return [...acc, product];
                    }, [], availableProducts);

                    res.status(OKEY_STATUS_CODE).send(checkingProductsDiscountTime);
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
