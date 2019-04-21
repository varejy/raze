import request from 'superagent';

import authenticateAction from '../actions/authenticate';

import { TOKEN_LOCAL_STORAGE_NAME } from '../contacts/contacts';

export default function authenticate () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        if (!token) {
            return dispatch(authenticateAction(false));
        }

        request
            .get('/api/admin/authentication/check')
            .query({ token })
            .then(() => {
                return dispatch(authenticateAction(true));
            })
            .catch(() => {
                return dispatch(authenticateAction(false));
            });
    };
}
