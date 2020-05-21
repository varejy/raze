import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';
import getAllProducts from '../../../client/product/queries/getAllProducts';

import includes from '@tinkoff/utils/array/includes';

const TOP_PRODUCTS_MAX_LENGTH = 8;

export default function getTopProducts (req, res) {
    getAllProducts()
        .then(products => {
            const topProducts = products
                .slice(0, TOP_PRODUCTS_MAX_LENGTH)
                .filter(product => includes(!product.notAvailable && 'topSales', product.tags));
            res.status(OKEY_STATUS_CODE).send(topProducts);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
