import request from 'superagent';
import base from './base';

import authenticateAction from '../actions/authenticate';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

import path from '@tinkoff/utils/object/path';

export default function authenticate (credentials) {
    return dispatch => base(
        request
            .post('/api/admin/authentication/authenticate')
            .send(credentials)
    )
        .then(payload => {
            const token = path(['body', 'token'], payload);

            localStorage.setItem(TOKEN_LOCAL_STORAGE_NAME, token);

            return dispatch(authenticateAction(true));
        });
}
