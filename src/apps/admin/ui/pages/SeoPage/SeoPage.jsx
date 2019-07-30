import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Accordion from './Accordion';

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
    }
});

class SeoPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    render () {
        const { classes } = this.props;

        return <div className={classes.container}>
            <Paper className={classes.paper}>
                <div className={classes.headerContainer}>
                    <Typography variant='h6' id='seoTitle'>SEO</Typography>
                </div>
                <Accordion/>
            </Paper>
        </div>;
    }
}

export default (withStyles(materialStyles)(SeoPage));
