import request from 'superagent';
import base from './base';

import setProductsAction from '../actions/setProducts';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function saveProduct (product) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .post('/api/admin/product/edit')
                .send(product)
                .query({ token })
        )
            .then(payload => {
                const products = payload.body;

                return dispatch(setProductsAction(products));
            });
    };
}
