import uniqid from 'uniqid';
import map from '@tinkoff/utils/array/map';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllCategories from '../../../client/category/queries/getAllCategories';
import saveCategoryQuery from '../../../client/category/queries/saveCategory';

export default function saveCategory (req, res) {
    const { name, path, hidden, filters } = req.body;
    const filtersWithIds = map(filter => {
        return {
            name: filter.name,
            type: filter.type,
            id: uniqid()
        };
    }, filters);

    const id = uniqid();

    saveCategoryQuery({ name, path, hidden, id, filters: filtersWithIds })
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
