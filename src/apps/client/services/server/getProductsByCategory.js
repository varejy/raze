import request from 'superagent';
import base from '../base';

import { matchPath } from 'react-router';

import setProductsToMap from '../../actions/setProductsToMap';

const CATEGORY_PATH = '/:category/';

export default function getProductsByCategory (req) {
    return dispatch => {
        const match = matchPath(req.path, { path: CATEGORY_PATH, exact: true });

        if (!match) {
            return dispatch(setProductsToMap({}));
        }

        const host = req.get('host');

        return base(
            request
                .get(`${host}/api/client/product/by-category`)
                .query({ name: match.params.category })
                .timeout({
                    deadline: 2000
                })
        )
            .then(products => {
                dispatch(setProductsToMap({
                    [match.params.category]: products
                }));
            })
            .catch(() => {
                return dispatch(setProductsToMap({}));
            });
    };
}
