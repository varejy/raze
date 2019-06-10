import getAllCategories from '../../../client/category/queries/getAllCategories';
import deleteByIdsQuery from '../../../client/category/queries/deleteByIds';
import nullifyCategories from '../../../client/product/queries/nullifyCategories';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

export default function deleteByIds (req, res) {
    const { ids } = req.body;

    deleteByIdsQuery(ids)
        .then(() => {
            nullifyCategories(ids)
                .then(() => {
                    getAllCategories()
                        .then(categories => {
                            res.status(OKEY_STATUS_CODE).send(categories);
                        });
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
