import uniqid from 'uniqid';

import fs from 'fs';
import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE, PRODUCT_FILE_FIELD_NAME_REGEX } from '../../../constants/constants';
import {
    getAllProducts,
    saveProduct as saveProductQuery,
    editProduct as editProductQuery,
    deleteByIds as deleteByIdsQuery,
    findProductsByName as findProductsByNameQuery
} from './queries';
import multipart from '../../../helpers/multipart';

import noop from '@tinkoff/utils/function/noop';

const uploader = multipart(PRODUCT_FILE_FIELD_NAME_REGEX);

export function getProducts (req, res) {
    getAllProducts()
        .then(products => {
            res.status(OKEY_STATUS_CODE).send(products);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}

export function saveProduct (req, res) {
    const product = getProduct(req.body);
    const id = uniqid();

    saveProductQuery({ ...product, id })
        .then(product => {
            res.status(OKEY_STATUS_CODE).send(product);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}

export function editProduct (req, res) {
    const product = getProduct(req.body);

    editProductQuery(product)
        .then(product => {
            res.status(OKEY_STATUS_CODE).send(product);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}

function getProduct (body) {
    const { name, company, price, description, features, categoryId, hidden, id } = body;

    return {
        name,
        company,
        price: +price,
        description,
        features,
        categoryId,
        hidden,
        id
    };
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
    uploader(req, res, (err) => {
        if (err) {
            return res.status(SERVER_ERROR_STATUS_CODE).end();
        }

        const filesPaths = [];
        const files = req.files;
        const { id } = req.query;
        const oldFiles = JSON.parse(req.body.oldFiles);
        const removedFiles = JSON.parse(req.body.removedFiles);

        files.forEach(file => {
            filesPaths[file.fieldname.replace(PRODUCT_FILE_FIELD_NAME_REGEX, '')] = `/${file.path.replace(/\\/g, '/')}`;
        });
        oldFiles.forEach((file) => {
            filesPaths[file.index] = file.path;
        });
        removedFiles.forEach(function (file) {
            fs.unlink(file.path.slice(1), noop);
        });

        editProductQuery({ files: filesPaths, id })
            .then(product => {
                res.status(OKEY_STATUS_CODE).send(product);
            })
            .catch(() => {
                filesPaths.forEach(function (filename) {
                    fs.unlink(filename.slice(1), noop);
                });

                return res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    });
}

export function findProductsByName (req, res) {
    const { text } = req.query;

    findProductsByNameQuery(text)
        .then(products => {
            res.status(OKEY_STATUS_CODE).send(products);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
