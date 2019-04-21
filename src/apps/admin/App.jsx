import React, { Component } from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import getStore from './store/getStore';

import MainPage from './ui/pages/MainPage/MainPage.jsx';

import '../../../client/vendor';
import '../../css/main.css';

const store = getStore();

class App extends Component {
    render () {
        return <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route exact path='/admin' component={MainPage} />
                </Switch>
            </BrowserRouter>
        </Provider>;
    }
}

render(
    <App />,
    document.getElementById('app')
);
