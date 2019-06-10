import { CLOSE_POPUP, OPEN_POPUP } from '../types/types';

const initialState = {
    content: null
};

export default function (state = initialState, action) {
    switch (action.type) {
    case OPEN_POPUP:
        return { ...state, content: action.payload };
    case CLOSE_POPUP:
        return { ...state, content: null };
    default:
        return state;
    }
}
