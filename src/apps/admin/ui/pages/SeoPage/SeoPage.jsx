import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import SeoTabs from '../../components/SeoTabs/SeoTabs';
import getAllSeo from '../../../services/getAllSeo';

import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

const materialStyles = () => ({
    paper: {
        padding: '0 24px 24px 24px'
    },
    container: {
        padding: '24px 0',
        width: '100%'
    },
    headerContainer: {
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start'
    },
    loader: {
        height: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
const mapDispatchToProps = (dispatch) => ({
    getAllSeo: payload => dispatch(getAllSeo(payload))
});

class SeoPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getAllSeo: PropTypes.func.isRequired
    };

    constructor (...args) {
        super(...args);

        this.state = {
            loading: true
        };
    }

    componentDidMount () {
        this.props.getAllSeo()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    render () {
        const { classes } = this.props;
        const { loading } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress />
            </div>;
        }

        return <div className={classes.container}>
            <Paper className={classes.paper}>
                <div className={classes.headerContainer}>
                    <Typography variant='h6' id='seoTitle'>SEO</Typography>
                </div>
                <SeoTabs/>
            </Paper>
        </div>;
    }
}

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(SeoPage));
