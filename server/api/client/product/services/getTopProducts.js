import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    TOP_PRODUCTS_MAX_LENGTH
} from '../../../../constants/constants';
import getAllProducts from '../../../client/product/queries/getAllProducts';

import includes from '@tinkoff/utils/array/includes';

export default function getTopProducts (req, res) {
    getAllProducts()
        .then(products => {
            const topProducts = products
                .slice(0, TOP_PRODUCTS_MAX_LENGTH)
                .filter(product => includes('topSales', product.tags) && product)
            res.status(OKEY_STATUS_CODE).send(topProducts);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
