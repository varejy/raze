import getAllCategories from '../../../client/category/queries/getAllCategories';
import getCategory from '../../../client/category/queries/getCategory';
import editCategoryQuery from '../../../client/category/queries/editCategory';
import hideProductsByCategory from '../../../client/product/queries/hideProductsByCategory';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

export default function editCategory (req, res) {
    const { name, path, hidden, id, filters } = req.body;

    getCategory(id)
        .then(oldCategory => {
            editCategoryQuery({ name, hidden, path, id, filters })
                .then(() => {
                    if (oldCategory.hidden === hidden) {
                        return;
                    }

                    return hideProductsByCategory(id, hidden);
                })
                .then(() => {
                    getAllCategories()
                        .then(categories => {
                            res.status(OKEY_STATUS_CODE).send(categories);
                        });
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        });
}
