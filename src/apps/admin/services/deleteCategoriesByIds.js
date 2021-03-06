import request from 'superagent';
import base from './base';

import setCategoriesAction from '../actions/setCategories';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function saveCategory (ids) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .post('/api/admin/category/delete-few')
                .send({ ids })
                .query({ token })
        )
            .then(categories => {
                return dispatch(setCategoriesAction(categories));
            });
    };
}
