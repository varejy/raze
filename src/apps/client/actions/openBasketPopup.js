import { OPEN_BASKET_POPUP } from '../types/types';

const openBasketPopup = payload => ({
    type: OPEN_BASKET_POPUP,
    payload
});

export default openBasketPopup;
