import React, { Component } from 'react';
import PropTypes from 'prop-types';

import media from './ui/hocs/media/media.jsx';

import '../../../client/vendor';
import '../../css/main.css';

import MainPage from './ui/pages/MainPage/MainPage.jsx';
import ProductsPage from './ui/pages/ProductsPage/ProductsPage.jsx';
import Header from './ui/components/Header/Header';
import Footer from './ui/components/Footer/Footer';

import { connect } from 'react-redux';

import { Switch, Route, withRouter } from 'react-router-dom';

import styles from './App.css';

const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories
    };
};

@media
class App extends Component {
    static propTypes = {
        categories: PropTypes.array
    };

    static defaultProps = {
        categories: []
    };

    render () {
        const { categories } = this.props;

        return <main>
            <div className={styles.page}>
                <Header/>
                <div className={styles.pageContent}>
                    <Switch>
                        <Route exact path='/' component={MainPage} />
                        { categories.map((category, i) => <Route exact key={i} path={`/${category.path}`} component={ProductsPage} />) }
                    </Switch>
                </div>
                <Footer />
            </div>
        </main>;
    }
}

export default withRouter(connect(mapStateToProps)(App));
