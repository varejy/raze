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
        classes: PropTypes.object.isRequired,
        pages: PropTypes.array.isRequired
    };

    constructor (props) {
        super(props);

        this.state = {
            panel: this.setDefault
        };
    }

    setDefault = () => {
        let defaultPanel = {};
        this.props.pages.map((page, i) => { defaultPanel['panel' + i] = false; });

        this.setState({
            panel: this.state.default
        });
    };

    handleChange = panelClicked => () => {
        this.setDefault();
        this.setState({ panel: {
            ...this.state.panel,
            [panelClicked]: this.state.panel[panelClicked] !== true
        }
        });
    };

    render () {
        const { classes, pages } = this.props;

        return <div className={classes.root}>
            {
                pages.map((page, i) => {
                    return <ExpansionPanel key={i} expanded={this.state[`panel${i}`]} onChange={this.handleChange(`panel${i}`)}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls={`panel${i}bh-content`}
                            id={`panel${i}bh-header`}
                        >
                            <Typography className={classes.heading}>{pages[i].header}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <MetaForm page={pages[i].page}/>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>;
                })
            }
        </div>;
    }
}

export default (withStyles(materialStyles)(SeoTabs));
