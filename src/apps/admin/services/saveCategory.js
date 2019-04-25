import request from 'superagent';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function saveCategory (category) {
    return () => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        if (!token) {
            return Promise.resolve();
        }

        return request
            .post('/api/admin/category/save')
            .send(category)
            .query({ token });
    };
}
