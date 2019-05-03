import request from 'superagent';
import base from './base';

import setMainSlider from '../actions/setMainSlider';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function editMainSlider (slides) {
    const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

    return dispatch => base(
        request
            .post('/api/admin/main-slider/edit')
            .query({ token })
            .send(slides)
    )
        .then(slider => {
            return dispatch(setMainSlider(slider));
        });
}
