import { OPEN_POPUP } from '../types/types';

const openPopup = payload => ({
    type: OPEN_POPUP,
    payload
});

export default openPopup;
