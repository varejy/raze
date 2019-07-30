import request from 'superagent';
import base from '../base';

import setTopProducts from '../../actions/setTopProducts';

export default function getTopProducts (req, res) {
    return dispatch => {
        const host = req.get('host');

        return base(
            request
                .get(`${host}/api/client/product/top`)
                .timeout({
                    deadline: 2000
                })
        )
            .then(products => {
                dispatch(setTopProducts(products));
            })
            .catch(() => {
                dispatch(setTopProducts([]));
            });
    };
}