import request from 'superagent';
import base from './base';

import setCategoriesAction from '../actions/setCategories';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function saveCategory (category) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .post('/api/admin/category/save')
                .send(category)
                .query({ token })
        )
            .then(payload => {
                const categories = payload.body;

                return dispatch(setCategoriesAction(categories));
            });
    };
}
