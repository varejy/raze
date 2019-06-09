import request from 'superagent';
import base from '../base';

import { matchPath } from 'react-router';

import setCategories from '../../actions/setCategories';
import setProductsToMap from '../../actions/setProductsToMap';

import find from '@tinkoff/utils/array/find';

export default function getCategoriesAndProducts (req) {
    return dispatch => {
        const host = req.get('host');

        return base(
            request
                .get(`${host}/api/client/category`)
                .timeout({
                    deadline: 1000
                })
        )
            .then(categories => {
                dispatch(setCategories(categories));

                const match = find(route => matchPath(req.path, { path: `/${route.path}`, exact: true }), categories);

                if (!match) {
                    return dispatch(setProductsToMap([]));
                }

                return base(
                    request
                        .get(`${host}/api/client/product/by-category-id`)
                        .query({ id: match.id })
                        .timeout({
                            deadline: 1000
                        })
                )
                    .then(products => {
                        dispatch(setProductsToMap({
                            [match.id]: products
                        }));
                    });
            })
            .catch(() => {
                dispatch(setCategories([]));
            });
    };
}
