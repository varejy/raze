import { combineReducers } from 'redux';

import application from './application';
import products from './products';
import orders from './orders';
import seo from './seo';

const reducers = combineReducers({
    application,
    products,
    orders,
    seo
});

export default reducers;
