import React, { Component } from 'react';

import media from './ui/hocs/media/media.jsx';

import '../../../client/vendor';
import '../../css/main.css';

import MainPage from './ui/pages/MainPage/MainPage.jsx';
import ProductsPage from './ui/pages/ProductsPage/ProductsPage.jsx';

import { Switch, Route, withRouter } from 'react-router-dom';

@media
class App extends Component {
    render () {
        return <main>
            <Switch>
                <Route exact path='/' component={MainPage} />
                <Route path='/ProductsPage' component={ProductsPage} />
            </Switch>
        </main>;
    }
}

export default withRouter(App);
