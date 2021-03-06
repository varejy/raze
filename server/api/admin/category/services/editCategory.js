import getAllCategories from '../../../client/category/queries/getAllCategories';
import getCategory from '../../../client/category/queries/getCategory';
import editCategoryQuery from '../../../client/category/queries/editCategory';
import hideProductsByCategory from '../../../client/product/queries/hideProductsByCategory';

import uniqid from 'uniqid';
import map from '@tinkoff/utils/array/map';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

export default function editCategory (req, res) {
    const { name, path, positionIndex, hidden, id, filters, metaTitle, metaDescription, metaKeywords } = req.body;

    const filtersWithIds = map(filter => {
        return {
            options: filter.options,
            name: filter.name,
            type: filter.type,
            id: filter.id || uniqid()
        };
    }, filters);

    getCategory(id)
        .then(oldCategory => {
            editCategoryQuery({ name, hidden, positionIndex, path, id, filters: filtersWithIds, metaTitle, metaDescription, metaKeywords })
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
