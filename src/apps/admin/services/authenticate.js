import request from 'superagent';

import path from '@tinkoff/utils/object/path';

export default function saveApplication (credentials) {
    return dispatch => request
        .post('/api/admin/authentication/authenticate')
        .send(credentials)
        .then(payload => {
            console.log(payload);
            const token = path(['body', 'token'], payload);

            return token;
        });
}
