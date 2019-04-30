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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FilterListIcon from '@material-ui/icons/FilterList';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';

import Modal from '@material-ui/core/Modal';
import ProductForm from '../ProductForm/ProductForm.jsx';
import ProductFilters from '../ProductFilters/ProductFilters.jsx';

import noop from '@tinkoff/utils/function/noop';

import { connect } from 'react-redux';
import deleteProductsByIds from '../../../services/deleteProductsByIds';

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
    productActions: {
        display: 'flex',
        alignItems: 'center',
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
        transform: 'translate(-50%, -50%)',
        overflowY: 'auto',
        maxHeight: '100vh'
    }
});

const mapDispatchToProps = (dispatch) => ({
    deleteProducts: payload => dispatch(deleteProductsByIds(payload))
});

class ProductTableHeader extends Component {
    static propTypes = {
        deleteProducts: PropTypes.func.isRequired,
        classes: PropTypes.object.isRequired,
        selected: PropTypes.array,
        onSelectedCloseClick: PropTypes.func
    };

    static defaultProps = {
        selected: [],
        onSelectedCloseClick: noop
    };

    state = {
        newProductFormShowed: false,
        warningShowed: false,
        filtersShowed: false
    };

    handleSelectedCloseClick = () => {
        this.props.onSelectedCloseClick();
    };

    handleAddProduct = () => {
        this.setState({
            newProductFormShowed: true
        });
    };

    handleFiltersClick = () => {
        this.setState({
            filtersShowed: true
        });
    };

    handleCloseNewProductForm = () => {
        this.setState({
            newProductFormShowed: false
        });
    };

    handleWarningDisagree = () => {
        this.setState({
            warningShowed: false
        });
    };

    handleWarningAgree = () => {
        const ids = this.props.selected.map(category => category.id);

        this.props.deleteProducts(ids)
            .then(() => {
                this.setState({
                    warningShowed: false
                });
            });
    };

    handleDelete = () => {
        this.setState({
            warningShowed: true
        });
    };

    handleCloseFilters = () => {
        this.setState({
            filtersShowed: false
        });
    };

    render () {
        const { classes, selected } = this.props;
        const { newProductFormShowed, warningShowed, filtersShowed } = this.state;

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
                            Товары
                        </Typography>
                    )}
                </div>
                <div className={classes.spacer} />
                <div className={classes.actions}>
                    {selected.length > 0 ? (
                        <Tooltip title='Delete'>
                            <IconButton aria-label='Delete' onClick={this.handleDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <div className={classes.productActions}>
                            <Tooltip title='Фильтрация'>
                                <IconButton aria-label='Filters' onClick={this.handleFiltersClick}>
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Добавление товара'>
                                <IconButton aria-label='Add product' onClick={this.handleAddProduct}>
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </Toolbar>
            <Modal open={newProductFormShowed} onClose={this.handleCloseNewProductForm}>
                <Paper className={classes.modalContent}>
                    <ProductForm onDone={this.handleCloseNewProductForm} />
                </Paper>
            </Modal>
            <Modal open={filtersShowed} onClose={this.handleCloseFilters} keepMounted>
                <Paper className={classes.modalContent}>
                    <ProductFilters />
                </Paper>
            </Modal>
            <Dialog
                open={warningShowed}
                onClose={this.handleWarningDisagree}
            >
                <DialogTitle>Вы точно хотите удалить следующие товары?</DialogTitle>
                <DialogContent className={classes.warningContent}>
                    <List>
                        {
                            selected.map((category, i) => <ListItem key={i}>
                                <ListItemText
                                    primary={category.name}
                                />
                            </ListItem>)
                        }
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleWarningDisagree} color='primary'>
                        Нет
                    </Button>
                    <Button onClick={this.handleWarningAgree} color='primary' autoFocus>
                        ДА
                    </Button>
                </DialogActions>
            </Dialog>
        </div>;
    }
}

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(ProductTableHeader));
