import request from 'superagent';
import base from './base';

import setComments from '../actions/setComments';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function saveComment (ids) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .post('/api/admin/comment/delete')
                .send({ ids })
                .query({ token })
        )
            .then(comments => {
                return dispatch(setComments(comments));
            });
    };
}
