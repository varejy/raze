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
import Link from '@material-ui/core/Link';

import CategoryTableHeader from '../CategoryTableHeader/CategoryTableHeader.jsx';

import compose from '@tinkoff/utils/function/compose';
import difference from '@tinkoff/utils/array/difference';
import slice from '@tinkoff/utils/array/slice';
import map from '@tinkoff/utils/array/map';
import concat from '@tinkoff/utils/array/concat';
import without from '@tinkoff/utils/array/without';

const categories = [
    { id: '1', name: 'Ножи', path: 'knives' },
    { id: '2', name: 'Топоры', path: 'axes' },
    { id: '3', name: 'Аксессуары', path: 'accessories' }
];

const rows = [
    { id: 'name', disablePadding: false, label: 'Название' },
    { id: 'category', disablePadding: false, label: 'Путь' }
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
    }
});

const ROWS_PER_PAGE = 10;

class CategoryTable extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    state = {
        selected: [],
        page: 0,
        rowsPerPage: categories.length > ROWS_PER_PAGE ? ROWS_PER_PAGE : categories.length,
        checkboxIndeterminate: false,
        categories
    };

    handleSelectAllClick = event => {
        const { categories, selected, rowsPerPage, page, checkboxIndeterminate } = this.state;

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
        const rowsPerPage = categories.length > value ? value : categories.length;
        const checkboxIndeterminate = this.checkCheckboxIndeterminate({ rowsPerPage });

        this.setState({ rowsPerPage, checkboxIndeterminate });
    };

    handleLinkClick = event => {
        event.stopPropagation();
    };

    checkCheckboxIndeterminate = (
        {
            rowsPerPage = this.state.rowsPerPage,
            page = this.state.page,
            selected = this.state.selected
        } = {}
    ) => {
        const { categories } = this.state;
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
        const { classes } = this.props;
        const { categories, selected, rowsPerPage, page, checkboxIndeterminate } = this.state;
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
                            {categories
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(category => {
                                    const isSelected = this.isSelected(category.id);

                                    return (
                                        <TableRow
                                            hover
                                            onClick={event => this.handleClick(event, category.id)}
                                            role='checkbox'
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={category.id}
                                            selected={isSelected}
                                        >
                                            <TableCell padding='checkbox'>
                                                <Checkbox checked={isSelected} />
                                            </TableCell>
                                            <TableCell component='th' scope='row'>{category.name}</TableCell>
                                            <TableCell component='th' scope='row'>
                                                <Link
                                                    onClick={this.handleLinkClick}
                                                    href={`${this.getHost()}/${category.path}`}
                                                    target='_blank'
                                                >
                                                    /{category.path}
                                                </Link>
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
            </Paper>
        );
    }
}

export default withStyles(materialStyles)(CategoryTable);
