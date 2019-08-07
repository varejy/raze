import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import findProductsByName from '../queries/findProductsByName';
import editProduct from '../queries/editProduct';
import checkingRemainingTime from '../utils/checkingRemainingTime';

export default function availableProductsSearch (req, res) {
    const { text } = req.query;

    findProductsByName(text)
        .then(products => {
            const availableProducts = products
                .filter(product => !product.hidden)
                .sort((prev, next) => next.date - prev.date);

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
            }, [], availableProducts);

            res.status(OKEY_STATUS_CODE).send(checkingProductsDiscountTime);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
