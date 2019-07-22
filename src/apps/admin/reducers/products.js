import {
    SET_PRODUCTS,
    SET_FILTERED_PRODUCTS,
    SET_COMMENTS
} from '../types/types';

const initialState = {
    products: [],
    filteredProducts: [],
    comments: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_PRODUCTS:
        return { ...state, products: action.payload };
    case SET_FILTERED_PRODUCTS:
        return { ...state, filtered: action.payload };
    case SET_COMMENTS:
        return { ...state, comments: action.payload };
    default:
        return state;
    }
}
