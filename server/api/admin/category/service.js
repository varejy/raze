import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../constants/constants';
import {
    getAllCategories,
    saveCategory as saveCategoryQuery,
    editCategory as editCategoryQuery,
    deleteByIds as deleteByIdsQuery
} from './queries';
import { nullifyCategories } from '../product/queries';

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
    const { name, path } = req.body;
    const id = uniqid();

    saveCategoryQuery({ name, path, id })
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
    const { name, path, id } = req.body;

    editCategoryQuery({ name, path, id })
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
