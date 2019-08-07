import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';
import getAllProducts from '../../../client/product/queries/getAllProducts';
import editProduct from '../queries/editProduct';
import checkingRemainingTime from '../utils/checkingRemainingTime';

import includes from '@tinkoff/utils/array/includes';

const TOP_PRODUCTS_MAX_LENGTH = 8;

export default function getTopProducts (req, res) {
    getAllProducts()
        .then(products => {
            const topProducts = products
                .slice(0, TOP_PRODUCTS_MAX_LENGTH)
                .filter(product => includes('topSales', product.tags));

            const checkingProductsDiscountTime = reduce((acc, product) => {
                if (!product.discountTime) {
                    return [...acc, product];
                } else {
                    if (checkingRemainingTime(product.discountTime).length) {
                        return [...acc, product];
                    } else {
                        product.discountPrice = '';
                        product.discountTime = '';
                        editProduct(product)
                            .then((product) => {
                                return [...acc, product]
                            })
                    }
                }
            }, [], topProducts);

            console.log(checkingProductsDiscountTime)

            res.status(OKEY_STATUS_CODE).send(checkingProductsDiscountTime);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
