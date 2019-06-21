import { combineReducers } from 'redux';

import application from './application';
import popup from './popup';
import savedProducts from './savedProducts';

const reducers = combineReducers({
    application,
    popup,
    savedProducts
});

export default reducers;
