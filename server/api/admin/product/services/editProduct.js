import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getProduct from '../utils/getProduct';

import editProductQuery from '../../../client/product/queries/editProduct';

export default function editProduct (req, res) {
    const product = getProduct(req.body);

    editProductQuery(product)
        .then(product => {
            res.status(OKEY_STATUS_CODE).send(product);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
