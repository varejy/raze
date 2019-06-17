import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getProductById from '../queries/getProductById';

export default function getAvailableProduct (req, res) {
    const { id } = req.query;

    getProductById(id)
        .then(([product]) => {
            if (!product || product.hidden) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            res.status(OKEY_STATUS_CODE).send(product);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
