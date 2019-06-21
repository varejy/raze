import { SET_VIEWED } from '../types/types';

const setViewed = payload => ({
    type: SET_VIEWED,
    payload
});

export default setViewed;
