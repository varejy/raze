import {
    SET_ORDERS,
    SET_FILTERED_ORDERS
} from '../types/types';

const initialState = {
    orders: [],
    filteredOrders: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_ORDERS:
        return { ...state, orders: action.payload, filtered: action.payload };

    case SET_FILTERED_ORDERS:
        return { ...state, filtered: action.payload };
    default:
        return state;
    }
}
