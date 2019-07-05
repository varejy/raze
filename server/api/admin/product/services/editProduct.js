import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareProduct from '../utils/prepareProduct';

import editProductQuery from '../../../client/product/queries/editProduct';

export default function editProduct (req, res) {
    const product = prepareProduct(req.body);

    editProductQuery(product)
        .then(product => {
            res.status(OKEY_STATUS_CODE).send(product);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
