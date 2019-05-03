import {
    SET_AUTHENTICATED,
    SET_CATEGORIES,
    SET_MAIN_SLIDER
} from '../types/types';

const initialState = {
    authenticated: null,
    categories: [],
    mainSlider: {
        slides: []
    }
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_AUTHENTICATED:
        return { ...state, authenticated: action.payload };
    case SET_CATEGORIES:
        return { ...state, categories: action.payload };
    case SET_MAIN_SLIDER:
        return { ...state, mainSlider: action.payload };
    default:
        return state;
    }
}
