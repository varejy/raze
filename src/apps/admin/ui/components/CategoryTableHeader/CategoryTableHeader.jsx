import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';

import Modal from '@material-ui/core/Modal';
import NewCategoryForm from '../NewCategoryForm/NewCategoryForm.jsx';

import noop from '@tinkoff/utils/function/noop';

const materialStyles = theme => ({
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85)
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark
            },
    spacer: {
        flex: '1 1 100%'
    },
    actions: {
        color: theme.palette.text.secondary
    },
    title: {
        flex: '0 0 auto'
    },
    itemsNumber: {
        display: 'flex',
        alignItems: 'center',
        width: '130px',
        justifyContent: 'space-between'
    },
    closeIcon: {
        cursor: 'pointer'
    },
    toolbar: {
        width: '100%',
        marginTop: theme.spacing.unit * 3
    },
    modalContent: {
        position: 'absolute',
        width: '1200px',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
});

class CategoryTableHeader extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        selected: PropTypes.array,
        onSelectedCloseClick: PropTypes.func
    };

    static defaultProps = {
        selected: [],
        onSelectedCloseClick: noop
    };

    state = {
        newCategoryFormShowed: false
    };

    handleSelectedCloseClick = () => {
        this.props.onSelectedCloseClick();
    };

    handleAddCategory = () => {
        this.setState({
            newCategoryFormShowed: true
        });
    };

    handleCloseNewCategoryForm = () => {
        this.setState({
            newCategoryFormShowed: false
        });
    };

    render () {
        const { classes, selected } = this.props;
        const { newCategoryFormShowed } = this.state;

        return <div>
            <Toolbar
                className={classNames(classes.toolbar, {
                    [classes.highlight]: selected.length > 0
                })}
            >
                <div className={classes.title}>
                    {selected.length > 0 ? (
                        <div className={classes.itemsNumber}>
                            <CloseIcon className={classes.closeIcon} onClick={this.handleSelectedCloseClick}/>
                            <Typography color='inherit' variant='subtitle1'>
                                {selected.length} выбрано
                            </Typography>
                        </div>
                    ) : (
                        <Typography variant='h6' id='tableTitle'>
                            Категории
                        </Typography>
                    )}
                </div>
                <div className={classes.spacer} />
                <div className={classes.actions}>
                    {selected.length > 0 ? (
                        <Tooltip title='Delete'>
                            <IconButton aria-label='Delete'>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title='Добавление категории'>
                            <IconButton aria-label='Add category' onClick={this.handleAddCategory}>
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
            </Toolbar>
            <Modal open={newCategoryFormShowed} onClose={this.handleCloseNewCategoryForm}>
                <Paper className={classes.modalContent}>
                    <NewCategoryForm />
                </Paper>
            </Modal>
        </div>;
    }
}

export default withStyles(materialStyles)(CategoryTableHeader);
