import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import uniqid from 'uniqid';

import append from '@tinkoff/utils/array/append';
import reduce from '@tinkoff/utils/array/reduce';
import find from '@tinkoff/utils/array/find';

import getSavedProductsQuery from '../queries/getSavedProducts';
import getProductsByIds from '../../product/queries/getProductsByIds';
import saveSavedProduct from '../queries/saveSavedProduct';

export default function getSavedProducts (req, res) {
    const { id } = req.query;

    if (!id) {
        return saveSavedProduct({
            basket: [],
            liked: [],
            viewed: [],
            id: uniqid()
        })
            .then((savedProducts) => {
                res.status(OKEY_STATUS_CODE).send(savedProducts);
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    }

    getSavedProductsQuery(id)
        .then(([savedProducts]) => {
            if (!savedProducts) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            const { basket, liked, viewed, id } = savedProducts;

            Promise.all([
                getProductsByIds(basket),
                getProductsByIds(liked),
                getProductsByIds(viewed)
            ])
                .then(([baskedProducts, likedProducts, viewedProducts]) => {
                    return [
                        reduce((products, { id, count }) => {
                            const product = find(product => product.id === id, baskedProducts);

                            return !product || product.hidden ? products : append({ product, count }, products);
                        }, [], basket),
                        reduce((products, id) => {
                            const product = find(product => product.id === id, likedProducts);

                            return !product || product.hidden ? products : append(product, products);
                        }, [], liked),
                        reduce((products, id) => {
                            const product = find(product => product.id === id, viewedProducts);

                            return !product || product.hidden ? products : append(product, products);
                        }, [], viewed)
                    ];
                })
                .then(([baskedProducts, likedProducts, viewedProducts]) => {
                    res.status(OKEY_STATUS_CODE).send({
                        basket: baskedProducts,
                        liked: likedProducts,
                        viewed: viewedProducts,
                        id
                    });
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
