import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllCategories from '../../../client/category/queries/getAllCategories';
import saveCategoryQuery from '../../../client/category/queries/saveCategory';

export default function saveCategory (req, res) {
    const { name, path, hidden, filters } = req.body;
    const id = uniqid();

    saveCategoryQuery({ name, path, hidden, id, filters })
        .then(() => {
            getAllCategories()
                .then(categories => {
                    res.status(OKEY_STATUS_CODE).send(categories);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
