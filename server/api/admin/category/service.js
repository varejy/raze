import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../constants/constants';
import {
    getAllCategories,
    getCategory,
    saveCategory as saveCategoryQuery,
    editCategory as editCategoryQuery,
    deleteByIds as deleteByIdsQuery
} from './queries';
import {
    nullifyCategories,
    hideProductsByCategory
} from '../product/queries';

export function getCategories (req, res) {
    getAllCategories()
        .then(categories => {
            res.status(OKEY_STATUS_CODE).send(categories);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}

export function saveCategory (req, res) {
    const { name, path, hidden } = req.body;
    const id = uniqid();

    saveCategoryQuery({ name, path, hidden, id })
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

export function editCategory (req, res) {
    const { name, path, hidden, id } = req.body;

    getCategory(id)
        .then(oldCategory => {
            editCategoryQuery({ name, hidden, path, id })
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

export function deleteByIds (req, res) {
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
