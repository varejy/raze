import { combineReducers } from 'redux';

import application from './application';
import products from './products';

const reducers = combineReducers({
    application,
    products
});

export default reducers;
