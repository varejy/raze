import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';

import compose from '@tinkoff/utils/function/compose';
import difference from '@tinkoff/utils/array/difference';
import slice from '@tinkoff/utils/array/slice';
import map from '@tinkoff/utils/array/map';
import concat from '@tinkoff/utils/array/concat';
import without from '@tinkoff/utils/array/without';

const products = [
    { id: '1', name: 'Нож 1', category: 'knife', price: 2000 },
    { id: '2', name: 'Нож 2', category: 'knife', price: 2300 },
    { id: '3', name: 'Нож 3', category: 'knife', price: 2100 },
    { id: '4', name: 'Нож 1', category: 'knife', price: 2000 },
    { id: '5', name: 'Нож 2', category: 'knife', price: 2300 },
    { id: '6', name: 'Нож 3', category: 'knife', price: 2100 },
    { id: '7', name: 'Нож 1', category: 'knife', price: 2000 },
    { id: '8', name: 'Нож 2', category: 'knife', price: 2300 },
    { id: '9', name: 'Нож 3', category: 'knife', price: 2100 },
    { id: '10', name: 'Нож 1', category: 'knife', price: 2000 },
    { id: '11', name: 'Нож 2', category: 'knife', price: 2300 },
    { id: '12', name: 'Нож 3', category: 'knife', price: 2100 },
    { id: '13', name: 'Нож 1', category: 'knife', price: 2000 },
    { id: '14', name: 'Нож 2', category: 'knife', price: 2300 },
    { id: '15', name: 'Нож 3', category: 'knife', price: 2100 },
    { id: '16', name: 'Нож 1', category: 'knife', price: 2000 },
    { id: '17', name: 'Нож 2', category: 'knife', price: 2300 },
    { id: '18', name: 'Нож 3', category: 'knife', price: 2100 },
    { id: '19', name: 'Нож 1', category: 'knife', price: 2000 },
    { id: '20', name: 'Нож 2', category: 'knife', price: 2300 },
    { id: '21', name: 'Нож 3', category: 'knife', price: 2100 }
];

const rows = [
    { id: 'name', disablePadding: false, label: 'Название' },
    { id: 'category', disablePadding: false, label: 'Категория' },
    { id: 'price', disablePadding: false, label: 'Цена' }
];

const materialStyles = theme => ({
    paper: {
        paddingRight: theme.spacing.unit
    },
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
    table: {
        minWidth: 1020
    },
    tableWrapper: {
        overflowX: 'auto'
    }
});

const ROWS_PER_PAGE = 10;

class ProductsTable extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    state = {
        selected: [],
        page: 0,
        rowsPerPage: products.length > ROWS_PER_PAGE ? ROWS_PER_PAGE : products.length,
        checkboxIndeterminate: false,
        products
    };

    handleSelectAllClick = event => {
        const { products, selected, rowsPerPage, page, checkboxIndeterminate } = this.state;

        if (event.target.checked && !checkboxIndeterminate) {
            const newSelected = compose(
                concat(selected),
                without(selected),
                slice(rowsPerPage * page, rowsPerPage * (page + 1)),
                map(product => product.id)
            )(products);

            return this.setState({
                selected: newSelected,
                checkboxIndeterminate: true
            });
        }

        const newSelected = without(
            compose(
                slice(rowsPerPage * page, rowsPerPage * (page + 1)),
                map(product => product.id)
            )(products),
            selected
        );

        this.setState({
            selected: newSelected,
            checkboxIndeterminate: false
        });
    };

    handleSelectedCloseClick = () => {
        this.setState({
            selected: [],
            checkboxIndeterminate: false
        });
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        const checkboxIndeterminate = this.checkCheckboxIndeterminate({ selected: newSelected });

        this.setState({ selected: newSelected, checkboxIndeterminate });
    };

    handleChangePage = (event, page) => {
        const checkboxIndeterminate = this.checkCheckboxIndeterminate({ page });

        this.setState({ page, checkboxIndeterminate });
    };

    handleChangeRowsPerPage = ({ target: { value } }) => {
        const rowsPerPage = products.length > value ? value : products.length;
        const checkboxIndeterminate = this.checkCheckboxIndeterminate({ rowsPerPage });

        this.setState({ rowsPerPage, checkboxIndeterminate });
    };

    checkCheckboxIndeterminate = (
        {
            rowsPerPage = this.state.rowsPerPage,
            page = this.state.page,
            selected = this.state.selected
        } = {}
    ) => {
        const { products } = this.state;
        const visibleProjects = products
            .map(product => product.id)
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        return !difference(visibleProjects, selected).length;
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render () {
        const { classes } = this.props;
        const { products, selected, rowsPerPage, page, checkboxIndeterminate } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, products.length - page * rowsPerPage);

        return (
            <Paper className={classes.paper}>
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
                                <IconButton aria-label='Delete'>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip title='Filter list'>
                                <IconButton aria-label='Filter list'>
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </Toolbar>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby='tableTitle'>
                        <TableHead>
                            <TableRow>
                                <TableCell padding='checkbox'>
                                    <Checkbox
                                        indeterminate={checkboxIndeterminate}
                                        checked={false}
                                        onChange={this.handleSelectAllClick}
                                    />
                                </TableCell>
                                {rows.map(
                                    row => (
                                        <TableCell
                                            key={row.id}
                                            padding={row.disablePadding ? 'none' : 'default'}
                                        >
                                            {row.label}
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(product => {
                                    const isSelected = this.isSelected(product.id);

                                    return (
                                        <TableRow
                                            hover
                                            onClick={event => this.handleClick(event, product.id)}
                                            role='checkbox'
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={product.id}
                                            selected={isSelected}
                                        >
                                            <TableCell padding='checkbox'>
                                                <Checkbox checked={isSelected} />
                                            </TableCell>
                                            <TableCell component='th' scope='row'>{product.name}</TableCell>
                                            <TableCell component='th' scope='row'>{product.category}</TableCell>
                                            <TableCell component='th' scope='row'>{product.price}</TableCell>
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
                    count={products.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        );
    }
}

export default withStyles(materialStyles)(ProductsTable);
