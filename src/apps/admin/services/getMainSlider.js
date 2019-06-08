import request from 'superagent';
import base from './base';

import setMainSlider from '../actions/setMainSlider';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getMainSlider () {
    const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

    return dispatch => base(
        request
            .get('/api/client/main-slider')
            .query({ token })
    )
        .then(slider => {
            return dispatch(setMainSlider(slider));
        });
}
