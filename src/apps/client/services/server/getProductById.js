import request from 'superagent';
import base from '../base';

import { matchPath } from 'react-router';

import setProductToMap from '../../actions/setProductToMap';

const PRODUCT_PATH = '/:category/:id';

export default function getProductById (req) {
    return dispatch => {
        const host = req.get('host');
        const match = matchPath(req.path, { path: PRODUCT_PATH, exact: true });

        if (!match) {
            return dispatch(setProductToMap({}));
        }

        return base(
            request
                .get(`${host}/api/client/product`)
                .query({ id: match.params.id })
                .timeout({
                    deadline: 2000
                })
        )
            .then(product => {
                dispatch(setProductToMap({
                    [product.id]: product
                }));
            })
            .catch(() => {
                dispatch(setProductToMap({
                    [match.params.id]: null
                }));
            });
    };
}
