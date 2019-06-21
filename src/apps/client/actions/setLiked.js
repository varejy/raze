import { SET_LIKED } from '../types/types';

const setLiked = payload => ({
    type: SET_LIKED,
    payload
});

export default setLiked;
