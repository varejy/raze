import {
    SET_PRODUCTS,
    SET_FILTERED_PRODUCTS
} from '../types/types';

const initialState = {
    products: [],
    filteredProducts: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_PRODUCTS:
        return { ...state, products: action.payload };
    case SET_FILTERED_PRODUCTS:
        return { ...state, filtered: action.payload };
    default:
        return state;
    }
}
