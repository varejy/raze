import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import checkAuthentication from './services/checkAuthentication';

import { Switch, Route } from 'react-router-dom';

import MainPage from './ui/pages/MainPage/MainPage.jsx';
import Authentication from './ui/components/Authentication/Authentication.jsx';
import CircularProgress from '@material-ui/core/CircularProgress';

import isNull from '@tinkoff/utils/is/nil';

import '../../../client/vendor';
import '../../css/main.css';

import styles from './App.css';

const mapStateToProps = ({ application }) => {
    return {
        authenticated: application.authenticated
    };
};

const mapDispatchToProps = (dispatch) => ({
    checkAuthentication: payload => dispatch(checkAuthentication(payload))
});

class App extends Component {
    static propTypes = {
        checkAuthentication: PropTypes.func.isRequired,
        authenticated: PropTypes.bool
    };

    componentDidMount () {
        this.props.checkAuthentication();
    }

    render () {
        const { authenticated } = this.props;

        if (isNull(authenticated)) {
            return <div className={styles.loader}>
                <CircularProgress />
            </div>;
        }

        return <main>
            {
                authenticated
                    ? <Switch>
                        <Route exact path='/admin' component={MainPage} />
                    </Switch>
                    : <Authentication />
            }
        </main>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);