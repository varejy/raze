import { combineReducers } from 'redux';

import application from './application';
import filters from './filters';

const reducers = combineReducers({
    application,
    filters
});

export default reducers;
