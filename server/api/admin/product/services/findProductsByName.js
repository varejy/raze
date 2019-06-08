import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import findProductsByNameQuery from '../../../client/product/queries/findProductsByName';

export default function findProductsByName (req, res) {
    const { text } = req.query;

    findProductsByNameQuery(text)
        .then(products => {
            res.status(OKEY_STATUS_CODE).send(products);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
