import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';

import ProductTableHeader from '../ProductTableHeader/ProductTableHeader.jsx';
import ProductForm from '../ProductForm/ProductForm';

import compose from '@tinkoff/utils/function/compose';
import difference from '@tinkoff/utils/array/difference';
import slice from '@tinkoff/utils/array/slice';
import concat from '@tinkoff/utils/array/concat';
import without from '@tinkoff/utils/array/without';
import find from '@tinkoff/utils/array/find';
import findIndex from '@tinkoff/utils/array/findIndex';
import any from '@tinkoff/utils/array/any';

import { connect } from 'react-redux';
import getProducts from '../../../services/getProducts';
import getCategories from '../../../services/getCategories';

const rows = [
    { id: 'name', label: 'Название' },
    { id: 'category', label: 'Категория' },
    { id: 'price', label: 'Цена' },
    { id: 'active', label: 'Active' }
];

const materialStyles = theme => ({
    paper: {
        paddingRight: theme.spacing.unit
    },
    table: {
        minWidth: 1020
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    loader: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        '&:hover $editIcon': {
            visibility: 'visible'
        }
    },
    editIcon: {
        visibility: 'hidden'
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

const ROWS_PER_PAGE = 10;

const mapStateToProps = ({ application, products }) => {
    return {
        products: products.filtered,
        categories: application.categories
    };
};

const mapDispatchToProps = (dispatch) => ({
    getProducts: payload => dispatch(getProducts(payload)),
    getCategories: payload => dispatch(getCategories(payload))
});

class ProductsTable extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getProducts: PropTypes.func.isRequired,
        getCategories: PropTypes.func.isRequired,
        products: PropTypes.array,
        categories: PropTypes.array
    };

    static defaultProps = {
        products: [],
        categories: []
    };

    constructor (...args) {
        super(...args);

        const { products } = this.props;

        const readyProducts = this.getProducts();

        this.state = {
            selected: [],
            products: readyProducts,
            page: 0,
            rowsPerPage: products.length > ROWS_PER_PAGE ? ROWS_PER_PAGE : products.length,
            checkboxIndeterminate: false,
            loading: true,
            editableProduct: null
        };
    }

    getProducts = (props = this.props) => {
        const { products, categories } = props;

        return products.map(product => {
            const category = find(category => category.id === product.categoryId, categories);

            return {
                ...product,
                categoryName: category ? category.name : 'Без категории'
            };
        });
    };

    componentDidMount () {
        Promise.all([
            this.props.getProducts(),
            this.props.getCategories()
        ])
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.products !== this.props.products || nextProps.categories !== this.props.categories) {
            const readyProducts = this.getProducts(nextProps);

            this.setState({
                rowsPerPage: nextProps.products.length > ROWS_PER_PAGE ? ROWS_PER_PAGE : nextProps.products.length,
                products: readyProducts,
                selected: []
            });
        }
    }

    handleSelectAllClick = event => {
        const { products, selected, rowsPerPage, page, checkboxIndeterminate } = this.state;

        if (event.target.checked && !checkboxIndeterminate) {
            const newSelected = compose(
                concat(selected),
                without(selected),
                slice(rowsPerPage * page, rowsPerPage * (page + 1))
            )(products);

            return this.setState({
                selected: newSelected,
                checkboxIndeterminate: true
            });
        }

        const newSelected = without(
            slice(rowsPerPage * page, rowsPerPage * (page + 1), products),
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

    handleClick = selectedProduct => () => {
        const { selected } = this.state;
        const selectedIndex = findIndex(product => product.id === selectedProduct.id, selected);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, selectedProduct);
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
        const { products } = this.state;
        const rowsPerPage = products.length > value ? value : products.length;
        const checkboxIndeterminate = this.checkCheckboxIndeterminate({ rowsPerPage });

        this.setState({ rowsPerPage, checkboxIndeterminate });
    };

    handleEditClick = product => event => {
        event.stopPropagation();

        this.setState({
            editableProduct: product
        });
    };

    handleCloseEditProductForm = () => {
        this.setState({
            editableProduct: null
        });
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
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        return !difference(visibleProjects, selected).length;
    };

    isSelected = id => any(product => product.id === id, this.state.selected);

    render () {
        const { classes } = this.props;
        const { products, selected, rowsPerPage, page, checkboxIndeterminate, loading, editableProduct } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress />
            </div>;
        }

        const emptyRows = rowsPerPage - Math.min(rowsPerPage, products.length - page * rowsPerPage);

        return (
            <Paper className={classes.paper}>
                <ProductTableHeader selected={selected} onSelectedCloseClick={this.handleSelectedCloseClick} />
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
                            {products
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((product, i) => {
                                    const isSelected = this.isSelected(product.id);

                                    return (
                                        <TableRow
                                            hover
                                            onClick={this.handleClick(product)}
                                            role='checkbox'
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={i}
                                            selected={isSelected}
                                            className={classes.row}
                                        >
                                            <TableCell padding='checkbox'>
                                                <Checkbox checked={isSelected} />
                                            </TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.categoryName}</TableCell>
                                            <TableCell>{product.price}</TableCell>
                                            <TableCell>
                                                {product.hidden ? <CloseIcon /> : <CheckIcon />}
                                            </TableCell>
                                            <TableCell padding='checkbox' align='right'>
                                                <IconButton
                                                    className={classes.editIcon}
                                                    onClick={this.handleEditClick(product)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
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
                    count={products.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
                <Modal open={!!editableProduct} onClose={this.handleCloseEditProductForm}>
                    <Paper className={classes.modalContent}>
                        <ProductForm product={editableProduct} onDone={this.handleCloseEditProductForm}/>
                    </Paper>
                </Modal>
            </Paper>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(ProductsTable));
