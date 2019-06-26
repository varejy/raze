import { CLOSE_POPUP, OPEN_POPUP, OPEN_BASKET_POPUP, CLOSE_BASKET_POPUP, OPEN_LIKED_POPUP, CLOSE_LIKED_POPUP } from '../types/types';

const initialState = {
    content: null,
    basketVisible: false,
    likedVisible: false
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
    case OPEN_LIKED_POPUP:
        return { ...state, likedVisible: true };
    case CLOSE_LIKED_POPUP:
        return { ...state, likedVisible: false };
    default:
        return state;
    }
}
