import request from 'superagent';
import base from './base';

import setComments from '../actions/setComments';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getComments () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .get('/api/admin/comment/all')
                .query({ token })
        )
            .then(comments => {
                return dispatch(setComments(comments));
            });
    };
}
