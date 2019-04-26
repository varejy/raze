import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import CategoryTableHeader from '../CategoryTableHeader/CategoryTableHeader.jsx';
import CategoryForm from '../CategoryForm/CategoryForm.jsx';

import compose from '@tinkoff/utils/function/compose';
import difference from '@tinkoff/utils/array/difference';
import slice from '@tinkoff/utils/array/slice';
import map from '@tinkoff/utils/array/map';
import concat from '@tinkoff/utils/array/concat';
import without from '@tinkoff/utils/array/without';

import getCategories from '../../../services/getCategories';

const rows = [
    { id: 'name', label: 'Название' },
    { id: 'category', label: 'Путь' }
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
    mainCell: {
        flex: 1
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

const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories
    };
};

const mapDispatchToProps = (dispatch) => ({
    getCategories: payload => dispatch(getCategories(payload))
});

class CategoryTable extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getCategories: PropTypes.func.isRequired,
        categories: PropTypes.array
    };

    static defaultProps = {
        categories: []
    };

    constructor (...args) {
        super(...args);

        const { categories } = this.props;

        this.state = {
            selected: [],
            page: 0,
            rowsPerPage: categories.length > ROWS_PER_PAGE ? ROWS_PER_PAGE : categories.length,
            checkboxIndeterminate: false,
            loading: true,
            editableCategory: null
        };
    }

    componentDidMount () {
        this.props.getCategories()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.categories.length !== this.props.categories.length) {
            this.setState({
                rowsPerPage: nextProps.categories.length > ROWS_PER_PAGE ? ROWS_PER_PAGE : nextProps.categories.length,
                selected: []
            });
        }
    }

    handleSelectAllClick = event => {
        const { categories } = this.props;
        const { selected, rowsPerPage, page, checkboxIndeterminate } = this.state;

        if (event.target.checked && !checkboxIndeterminate) {
            const newSelected = compose(
                concat(selected),
                without(selected),
                slice(rowsPerPage * page, rowsPerPage * (page + 1)),
                map(category => category.id)
            )(categories);

            return this.setState({
                selected: newSelected,
                checkboxIndeterminate: true
            });
        }

        const newSelected = without(
            compose(
                slice(rowsPerPage * page, rowsPerPage * (page + 1)),
                map(category => category.id)
            )(categories),
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

    handleClick = id => () => {
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
        const { categories } = this.props;
        const rowsPerPage = categories.length > value ? value : categories.length;
        const checkboxIndeterminate = this.checkCheckboxIndeterminate({ rowsPerPage });

        this.setState({ rowsPerPage, checkboxIndeterminate });
    };

    handleLinkClick = event => {
        event.stopPropagation();
    };

    handleEditClick = category => event => {
        event.stopPropagation();

        this.setState({
            editableCategory: category
        });
    };

    handleCloseEditCategoryForm = () => {
        this.setState({
            editableCategory: null
        });
    };

    checkCheckboxIndeterminate = (
        {
            rowsPerPage = this.state.rowsPerPage,
            page = this.state.page,
            selected = this.state.selected
        } = {}
    ) => {
        const { categories } = this.props;
        const visibleProjects = categories
            .map(category => category.id)
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        return !difference(visibleProjects, selected).length;
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    getHost = () => {
        const protocol = location.hostname === 'localhost' ? 'http://' : 'https://';

        return `${protocol}${location.host}`;
    };

    render () {
        const { classes, categories } = this.props;
        const { selected, rowsPerPage, page, checkboxIndeterminate, loading, editableCategory } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress />
            </div>;
        }

        const emptyRows = rowsPerPage - Math.min(rowsPerPage, categories.length - page * rowsPerPage);

        return (
            <Paper className={classes.paper}>
                <CategoryTableHeader selected={selected} onSelectedCloseClick={this.handleSelectedCloseClick} />
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
                            {categories
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((category, i) => {
                                    const isSelected = this.isSelected(category.id);

                                    return (
                                        <TableRow
                                            hover
                                            onClick={this.handleClick(category.id)}
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
                                            <TableCell className={classes.mainCell}>{category.name}</TableCell>
                                            <TableCell className={classes.mainCell}>
                                                <Link
                                                    onClick={this.handleLinkClick}
                                                    href={`${this.getHost()}/${category.path}`}
                                                    target='_blank'
                                                >
                                                    /{category.path}
                                                </Link>
                                            </TableCell>
                                            <TableCell padding='checkbox' align='right'>
                                                <IconButton
                                                    className={classes.editIcon}
                                                    onClick={this.handleEditClick(category)}
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
                    count={categories.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
                <Modal open={!!editableCategory} onClose={this.handleCloseEditCategoryForm}>
                    <Paper className={classes.modalContent}>
                        <CategoryForm category={editableCategory} onDone={this.handleCloseEditCategoryForm}/>
                    </Paper>
                </Modal>
            </Paper>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(CategoryTable));