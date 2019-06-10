import { combineReducers } from 'redux';

import application from './application';
import popup from './popup';

const reducers = combineReducers({
    application,
    popup
});

export default reducers;
