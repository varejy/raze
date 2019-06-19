import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getCategoriesByPath from '../../category/queries/getCategoriesByPath';
import getProductsByCategoryId from '../queries/getProductsByCategoryId';

export default function getAvailableProductsByCategory (req, res) {
    const { name } = req.query;

    getCategoriesByPath(name)
        .then(([category]) => {
            getProductsByCategoryId(category.id)
                .then(products => {
                    const availableProducts = products.filter(product => !product.hidden);

                    res.status(OKEY_STATUS_CODE).send(availableProducts);
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
