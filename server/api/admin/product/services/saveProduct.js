import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getProduct from '../utils/getProduct';

import saveProductQuery from '../../../client/product/queries/saveProduct';

export default function saveProduct (req, res) {
    const product = getProduct(req.body);
    const id = uniqid();

    saveProductQuery({ ...product, id })
        .then(product => {
            res.status(OKEY_STATUS_CODE).send(product);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
