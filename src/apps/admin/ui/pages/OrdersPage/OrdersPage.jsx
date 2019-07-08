import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import TablePagination from '@material-ui/core/TablePagination';
import FilterListIcon from '@material-ui/icons/FilterList';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

import ProductForm from '../../components/ProductForm/ProductForm';
import ProductFilters from '../../components/ProductFilters/ProductFilters';

import { connect } from 'react-redux';
import getOrders from '../../../services/getOrders';

import format from 'date-fns/format';

const ROWS_PER_PAGE = 10;
const headerRows = [
    { id: 'name', label: 'Имя' },
    { id: 'phone', label: 'Телефон' },
    { id: 'date', label: 'Дата' },
    { id: 'status', label: 'Статус' }
];
const tableCells = [
    { prop: order => order.name },
    { prop: order => order.phone },
    { prop: order => format(order.date, 'hh:mm:ss - DD MMM YYYY') },
    { prop: order => order.status }
];

const materialStyles = theme => ({
    loader: {
        height: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        position: 'absolute',
        width: '1200px',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
        overflowY: 'auto',
        maxHeight: '100vh'
    },
    spacer: {
        flex: '1 1 100%'
    },
    actions: {
        color: theme.palette.text.secondary
    },
    valuesActions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    toolbar: {
        width: '100%',
        marginTop: theme.spacing.unit * 3
    }
});

const mapStateToProps = ({ orders }) => {
    return {
        orders: orders.orders
    };
};

const mapDispatchToProps = (dispatch) => ({
    getOrders: payload => dispatch(getOrders(payload))
});

class OrdersPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getOrders: PropTypes.func.isRequired,
        orders: PropTypes.array
    };

    static defaultProps = {
        orders: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            loading: true,
            formShowed: false,
            filtersShowed: false,
            editableOrder: null,
            page: 0
        };
    }

    componentDidMount () {
        this.props.getOrders()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.orders !== this.props.orders) {
            this.setState({
                rowsPerPage: nextProps.orders.length > ROWS_PER_PAGE ? ROWS_PER_PAGE : nextProps.orders.length,
                selected: []
            });
        }
    }

    handleFormDone = () => {
        this.props.getOrders()
            .then(this.handleCloseProductForm);
    };

    handleFormOpen = order => () => {
        this.setState({
            formShowed: true,
            editableOrder: order
        });
    };

    handleFiltersOpen = () => {
        this.setState({
            filtersShowed: true
        });
    };

    handleCloseOrderForm = () => {
        this.setState({
            formShowed: false,
            editableOrder: null
        });
    };

    handleCloseFilters = () => {
        this.setState({
            filtersShowed: false
        });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = ({ target: { value } }) => {
        const { orders } = this.props;
        const rowsPerPage = orders.length > value ? value : orders.length;

        this.setState({ rowsPerPage });
    };

    render () {
        const { classes, orders } = this.props;
        const { loading, editableOrder, formShowed, filtersShowed, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, orders.length - page * rowsPerPage);

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress />
            </div>;
        }

        return <div>

            <Paper className={classes.paper}>
                <Toolbar
                    className={classes.toolbar}
                >
                    <Typography variant='h6' id='tableTitle'>
                        Заказы
                    </Typography>
                    <div className={classes.spacer} />
                    <div className={classes.actions}>
                        <div className={classes.valuesActions}>
                            <Tooltip title='Фильтрация'>
                                <IconButton aria-label='Filters' onClick={this.handleFiltersOpen}>
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                </Toolbar>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby='tableTitle'>
                        <TableHead>
                            <TableRow>
                                {headerRows.map(
                                    (row, i) => (
                                        <TableCell key={i}>
                                            {row.label}
                                        </TableCell>
                                    )
                                )}
                                <TableCell align='right' />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((value, i) => {
                                    return (
                                        <TableRow
                                            hover
                                            role='checkbox'
                                            tabIndex={-1}
                                            key={i}
                                            className={classes.row}
                                        >
                                            { tableCells.map((tableCell, i) => <TableCell key={i}>{tableCell.prop(value)}</TableCell>) }
                                            <TableCell padding='checkbox' align='right'>
                                                <div className={classes.valueActions}>
                                                    <IconButton onClick={this.handleFormOpen(value)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[10, 20, 30]}
                    component='div'
                    count={orders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
            <Modal open={formShowed} onClose={this.handleCloseOrderForm} className={classes.modal}>
                <Paper className={classes.modalContent}>
                    <ProductForm product={editableOrder} onDone={this.handleFormDone}/>
                </Paper>
            </Modal>
            <Modal open={filtersShowed} onClose={this.handleCloseFilters} className={classes.modal} keepMounted>
                <Paper className={classes.modalContent}>
                    <ProductFilters />
                </Paper>
            </Modal>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(OrdersPage));
