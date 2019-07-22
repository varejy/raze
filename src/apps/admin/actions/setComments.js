import { SET_COMMENTS } from '../types/types';

const setComments = payload => ({
    type: SET_COMMENTS,
    payload
});

export default setComments;
