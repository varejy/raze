import React, { Component } from 'react';

import media from './ui/hocs/media/media.jsx';

import '../../../client/vendor';
import '../../css/main.css';

import MainPage from './ui/pages/MainPage/MainPage.jsx';
import ProductsPage from './ui/pages/ProductsPage/ProductsPage.jsx';
import SearchPage from './ui/pages/SearchPage/SearchPage.jsx';
import ProductPage from './ui/pages/ProductPage/ProductPage.jsx';
import Header from './ui/components/Header/Header';
import Footer from './ui/components/Footer/Footer';
import Popup from './ui/components/Popup/Popup';

import { Switch, Route, withRouter } from 'react-router-dom';

import styles from './App.css';
import Basket from './ui/components/PopupBasket/Basket';

@media
class App extends Component {
    render () {
        return <main>
            <div className={styles.page}>
                <Header/>
                <Route exact path='/:category' component={Popup} />
                <Basket/>
                <div className={styles.pageContent}>
                    <Switch>
                        <Route exact path='/' component={MainPage} />
                        <Route exact path='/search' component={SearchPage} />
                        <Route exact path='/:category' component={ProductsPage} />
                        <Route exact path='/:category/:id' component={ProductPage} />
                    </Switch>
                </div>
                <Footer />
            </div>
        </main>;
    }
}

export default withRouter(App);
