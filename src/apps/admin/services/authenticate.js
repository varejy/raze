import request from 'superagent';

import authenticateAction from '../actions/authenticate';

import { TOKEN_LOCAL_STORAGE_NAME } from '../contacts/contacts';

import path from '@tinkoff/utils/object/path';

export default function authenticate (credentials) {
    return dispatch => request
        .post('/api/admin/authentication/authenticate')
        .send(credentials)
        .then(payload => {
            const token = path(['body', 'token'], payload);

            localStorage.setItem(TOKEN_LOCAL_STORAGE_NAME, token);

            return dispatch(authenticateAction(true));
        });
}