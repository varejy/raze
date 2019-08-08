import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import MetaForm from '../MetaForm/MetaForm';

const materialStyles = () => ({
    root: {
        width: '100%'
    },
    heading: {
        fontSize: '15px',
        flexBasis: '33.33%',
        flexShrink: 0
    }
});

class SeoTabs extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    constructor (props) {
        super(props);
        this.state = {
            panel1: false,
            panel2: false,
            panel3: false
        };
    }

    handleChange = panel => () => {
        this.setState({
            panel1: false,
            panel2: false,
            panel3: false,
            [panel]: this.state[panel] !== true
        });
    };

    render () {
        const { classes } = this.props;

        return <div className={classes.root}>
            <ExpansionPanel expanded={this.state.panel1} onChange={this.handleChange('panel1')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography className={classes.heading}>Главная страница</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <MetaForm page='main'/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={this.state.panel2} onChange={this.handleChange('panel2')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography className={classes.heading}>Страница заказа</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <MetaForm page='order'/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={this.state.panel3} onChange={this.handleChange('panel3')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                >
                    <Typography className={classes.heading}>Страница поиска</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <MetaForm page='search'/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>;
    }
}

export default (withStyles(materialStyles)(SeoTabs));
