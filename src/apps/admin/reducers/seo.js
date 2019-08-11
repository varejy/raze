import {
    SET_SEO
} from '../types/types';

const initialState = {
    allSeo: []
};

export default function (state = initialState, action) {
    if (action.type === SET_SEO) {
        return { ...state, allSeo: action.payload };
    } else {
        return state;
    }
}
