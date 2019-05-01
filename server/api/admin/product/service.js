import uniqid from 'uniqid';

import fs from 'fs';
import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../constants/constants';
import {
    getAllProducts,
    saveProduct as saveProductQuery,
    editProduct as editProductQuery,
    deleteByIds as deleteByIdsQuery
} from './queries';
import multipart from '../../../helpers/multipart';

const uploader = multipart();

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
    const { name, price, description, features, categoryId, hidden } = req.body;
    const id = uniqid();

    saveProductQuery({ name, price: +price, description, features, categoryId, hidden, id })
        .then(product => {
            res.status(OKEY_STATUS_CODE).send(product);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}

export function editProduct (req, res) {
    const { name, price, description, features, categoryId, hidden, id } = req.body;

    editProductQuery({ name, price: +price, description, features, categoryId, hidden, id })
        .then(product => {
            res.status(OKEY_STATUS_CODE).send(product);
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
                .then(products => {
                    res.status(OKEY_STATUS_CODE).send(products);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}

export function updateFiles (req, res) {
    const { id } = req.query;

    uploader(req, res, (err) => {
        if (err) {
            return res.status(SERVER_ERROR_STATUS_CODE).end();
        }

        const files = req.files;
        const filesPaths = files.map((file) => {
            return `/${file.path.replace(/\\/g, '/')}`;
        });

        editProductQuery({ files: filesPaths, id })
            .then(product => {
                res.status(OKEY_STATUS_CODE).send(product);
            })
            .catch(() => {
                filesPaths.forEach(function (filename) {
                    fs.unlink(filename.slice(1));
                });

                return res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    });
}
