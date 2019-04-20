import React, { Component } from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import getStore from './store/getStore';

import '../../../client/vendor';
import '../../css/main.css';

const store = getStore();

class App extends Component {
    render () {
        return <Provider store={store}>
            <BrowserRouter>
                <div>Admin</div>
            </BrowserRouter>
        </Provider>;
    }
}

render(
    <App />,
    document.getElementById('app')
);
