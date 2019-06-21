import {
    SET_BASKET,
    SET_LIKED,
    SET_VIEWED
} from '../types/types';

const initialState = {
    basket: [],
    liked: [],
    viewed: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_BASKET:
        return { ...state, basket: action.payload };
    case SET_LIKED:
        return { ...state, liked: action.payload };
    case SET_VIEWED:
        return { ...state, viewed: action.payload };
    default:
        return state;
    }
}
