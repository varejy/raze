import request from 'superagent';
import base from './base';

import setCategoriesAction from '../actions/setCategories';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getCategories () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        if (!token) {
            return Promise.resolve();
        }

        return base(
            request
                .get('/api/admin/category/all')
                .query({ token })
        )
            .then(payload => {
                const categories = payload.body;

                return dispatch(setCategoriesAction(categories));
            });
    };
}