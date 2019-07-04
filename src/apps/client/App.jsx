import React, { Component } from 'react';
import { connect } from 'react-redux';

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
import Liked from './ui/components/PopupLiked/Liked';
import License from './ui/components/PopupLicense/License';
import PropTypes from 'prop-types';
import closePopup from './actions/closePopup';
import closeBasketPopup from './actions/closeBasketPopup';
import closeLikedPopup from './actions/closeLikedPopup';
import closeLicensePopup from './actions/closeLicensePopup';

const mapDispatchToProps = (dispatch) => ({
    closePopup: payload => dispatch(closePopup(payload)),
    closeBasketPopup: payload => dispatch(closeBasketPopup(payload)),
    closeLikedPopup: payload => dispatch(closeLikedPopup(payload)),
    closeLicensePopup: payload => dispatch(closeLicensePopup(payload))
});

@media
class App extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        closePopup: PropTypes.func.isRequired,
        closeBasketPopup: PropTypes.func.isRequired,
        closeLikedPopup: PropTypes.func.isRequired,
        closeLicensePopup: PropTypes.func.isRequired
    };

    static defaultProps = {
        location: {}
    };

    componentWillReceiveProps (nextProps) {
        if (this.props.location !== nextProps.location) {
            window.scrollTo(0,0);
            this.props.closePopup();
            this.props.closeBasketPopup();
            this.props.closeLikedPopup();
            this.props.closeLicensePopup();
        }
    };

    render () {
        return <main>
            <div className={styles.page}>
                <Header/>
                <Popup/>
                <Basket/>
                <Liked/>
                <License/>
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

export default withRouter(connect(null, mapDispatchToProps)(App));
