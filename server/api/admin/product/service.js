import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../constants/constants';
import {
    getAllProducts,
    saveProduct as saveProductQuery,
    editProduct as editProductQuery,
    deleteByIds as deleteByIdsQuery
} from './queries';

export function getProducts (req, res) {
    getAllProducts()
        .then(categories => {
            res.status(OKEY_STATUS_CODE).send(categories);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}

export function saveProduct (req, res) {
    const { name, price, categoryId } = req.body;
    const id = uniqid();

    saveProductQuery({ name, price: +price, categoryId, id })
        .then(() => {
            getAllProducts()
                .then(categories => {
                    res.status(OKEY_STATUS_CODE).send(categories);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}

export function editProduct (req, res) {
    const { name, price, categoryId, id } = req.body;

    editProductQuery({ name, price: +price, categoryId, id })
        .then(() => {
            getAllProducts()
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
            getAllProducts()
                .then(categories => {
                    res.status(OKEY_STATUS_CODE).send(categories);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
