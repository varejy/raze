import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllProducts from '../../../client/product/queries/getAllProducts';
import deleteByIdsQuery from '../../../client/product/queries/deleteByIds';

export default function deleteByIds (req, res) {
    const { ids } = req.body;

    deleteByIdsQuery(ids)
        .then(() => {
            getAllProducts()
                .then(products => {
                    res.status(OKEY_STATUS_CODE).send(products);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
