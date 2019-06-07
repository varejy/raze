import {
    SET_FILTERS
} from '../types/types';
import filtersNav from '../fakeServerRespond/filtersNav';

const initialState = {
    filtersNav
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_FILTERS:
        return { ...state, filtersNav: action.payload };
    default:
        return state;
    }
}
