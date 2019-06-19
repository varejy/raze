import { CLOSE_POPUP, OPEN_POPUP, OPEN_BASKET_POPUP, CLOSE_BASKET_POPUP } from '../types/types';

const initialState = {
    content: null,
    basketVisible: false
};

export default function (state = initialState, action) {
    switch (action.type) {
    case OPEN_POPUP:
        return { ...state, content: action.payload };
    case CLOSE_POPUP:
        return { ...state, content: null };
    case OPEN_BASKET_POPUP:
        return { ...state, basketVisible: true };
    case CLOSE_BASKET_POPUP:
        return { ...state, basketVisible: false };
    default:
        return state;
    }
}
