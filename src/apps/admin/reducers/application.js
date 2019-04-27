import {
    SET_AUTHENTICATED,
    SET_CATEGORIES,
    SET_PRODUCTS
} from '../types/types';

const initialState = {
    authenticated: null,
    categories: [],
    products: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_AUTHENTICATED:
        return { ...state, authenticated: action.payload };
    case SET_CATEGORIES:
        return { ...state, categories: action.payload };
    case SET_PRODUCTS:
        return { ...state, products: action.payload };
    default:
        return state;
    }
}
