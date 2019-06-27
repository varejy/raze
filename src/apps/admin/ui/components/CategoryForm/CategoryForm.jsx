import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { withStyles } from '@material-ui/core/styles';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import { connect } from 'react-redux';
import saveCategory from '../../../services/saveCategory';
import editCategory from '../../../services/editCategory';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import remove from '@tinkoff/utils/array/remove';

import arrayMove from '../../../utils/arrayMove';

const SORTING_BUTTON_IMG = '/src/apps/admin/ui/components/CategoryForm/icon/baseline-reorder.svg';

const ButtonSortable = SortableHandle(({ imageClassName, onLoad }) => (
    <img className={imageClassName} src={SORTING_BUTTON_IMG} onLoad={onLoad} />
));

const FilterSortable = SortableElement(({ index, filter, isSorting, handleFilterDelete, handleFilterChange, handleFilterTypeChange, classes }) => (
    <FormGroup className={classNames(classes.filter, { [classes.filterIsSortable]: isSorting })} row>
        <div className={classes.filterGroup}>
            <ButtonSortable imageClassName={classes.buttonSortable}/>
            <div className={classes.filterInputsWrapp}>
                <TextField
                    className={classes.filterField}
                    label='Название'
                    value={filter.name}
                    onChange={handleFilterChange('name', index)}
                    margin='normal'
                    variant='outlined'
                    required
                />
                <FormControl variant="outlined" required className={classes.filterField}>
                    <InputLabel>
                        Type
                    </InputLabel>
                    <Select
                        value={filter.type}
                        onChange={value => handleFilterTypeChange(value.target.value, index)}
                        input={<OutlinedInput value={filter.type} labelWidth={45} name="Type" />}
                    >
                        <MenuItem value=''>
                            <em></em>
                        </MenuItem>
                        <MenuItem value='Checkbox'>Checkbox</MenuItem>
                        <MenuItem value='Range'>Range</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <IconButton aria-label='Delete' className={classes.deleteFilterButton} onClick={handleFilterDelete(index)}>
                <DeleteIcon />
            </IconButton>
        </div>
    </FormGroup>
));

const SlidesFilters = SortableContainer(({ filters, classes, ...reset }) =>
    <div className={classes.filtersWrapp}>
        {
            filters.map((filter, i) => <FilterSortable key={i} index={i} filter={filter} {...reset} classes={classes}/>)
        }
    </div>
);

const CATEGORY_VALUES = ['name', 'path', 'hidden'];

const mapDispatchToProps = (dispatch) => ({
    saveCategory: payload => dispatch(saveCategory(payload)),
    editCategory: payload => dispatch(editCategory(payload))
});

const materialStyles = theme => ({
    createFiltersWrapp: {
        display: 'flex',
        flexDirection: 'column'
    },
    createFiltersHeader: {
        display: 'flex'
    },
    filterTitle: {
        marginRight: '20px',
        display: 'flex',
        alignItems: 'center'
    },
    filter: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        zIndex: '2000',
        justifyContent: 'center'
    },
    filterGroup: {
        display: 'flex',
        marginTop: '20px',
        paddingLeft: '40px',
        paddingRight: '40px',
        alignItems: 'center',
        borderRadius: '4px',
        width: '100%',
        backgroundColor: '#F3F3F3'
    },
    filterIsSortable: {
        zIndex: '2000',
        userSelect: 'none'
    },
    filterInputsWrapp: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        paddingLeft: '40px',
        justifyContent: 'space-between'
    },
    filterField: {
        width: 'calc(50% - 20px)',
        height: '56px',
        backgroundColor: '#ffffff',
        marginTop: '12px',
        marginBottom: '12px'
    },
    deleteFilterButton: {
        height: '50px',
        width: '50px'
    },
    buttonSortable: {
        cursor: 'grab'
    },
    selectEmpty: {
        marginTop: 2 * theme.spacing.unit
    },
    divider: {
        marginTop: 2 * theme.spacing.unit,
        marginBottom: 2 * theme.spacing.unit
    }
});

class CategoryForm extends Component {
    static propTypes = {
        saveCategory: PropTypes.func.isRequired,
        editCategory: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        category: PropTypes.object,
        classes: PropTypes.object
    };

    static defaultProps = {
        onDone: noop,
        category: {}
    };

    constructor (...args) {
        super(...args);

        const { category } = this.props;

        this.state = {
            category: {
                hidden: false,
                ...pick(CATEGORY_VALUES, category)
            },
            id: prop('id', category),
            filters: [],
            isSorting: false
        };
    }

    handleSubmit = event => {
        event.preventDefault();

        const { id } = this.state;

        (id ? this.props.editCategory({ ...this.state.category, id }) : this.props.saveCategory(this.state.category))
            .then(() => {
                this.props.onDone();
            });
    };

    handleChange = prop => event => {
        this.setState({
            category: {
                ...this.state.category,
                [prop]: event.target.value
            }
        });
    };

    handleCheckboxChange = prop => (event, value) => {
        this.setState({
            category: {
                ...this.state.category,
                [prop]: value
            }
        });
    };
    handleFilterTypeChange = (value, id) => {
        const { filters } = this.state;

        filters[id].type = value;

        this.setState({
            filters: filters
        });
    }

    handleFilterAdd = () => {
        const { filters } = this.state;

        this.setState({
            filters: [
                ...filters,
                { name: '', type: '' }
            ]
        });
    }

    handleFilterChange = (prop, i) => event => {
        const { filters } = this.state;

        filters[i][prop] = event.target.value;

        this.setState({
            filters: filters
        });
    };

    handleFilterDelete = i => () => {
        const { filters } = this.state;

        this.setState({
            filters: remove(i, 1, filters)
        });
    };

    onDragStart = () => {
        this.setState({
            isSorting: true
        });
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        this.setState({
            filters: arrayMove(this.state.filters, oldIndex, newIndex),
            isSorting: false
        });
    };

    render () {
        const { classes } = this.props;
        const { category, isSorting, id, filters } = this.state;

        return <form onSubmit={this.handleSubmit}>
            <Typography variant='h5'>{id ? 'Редактирование категории' : 'Добавление новой категории'}</Typography>
            <TextField
                label='Название'
                value={category.name}
                onChange={this.handleChange('name')}
                margin='normal'
                variant='outlined'
                fullWidth
                required
            />
            <TextField
                label='Путь'
                value={category.path}
                onChange={this.handleChange('path')}
                margin='normal'
                variant='outlined'
                fullWidth
                required
            />
            <div>
                <FormControlLabel
                    control ={
                        <Checkbox
                            checked={category.hidden}
                            onChange={this.handleCheckboxChange('hidden')}
                            color='primary'
                        />
                    }
                    label='Скрыть категорию и товары в ней'
                />
            </div>
            <div className={classes.createFiltersWrapp}>
                <div className={classes.createFiltersHeader}>
                    <Typography className={classes.filterTitle} variant='h5'>Фильтр</Typography>
                    <Fab size="small" color='primary' onClick={this.handleFilterAdd} aria-label="Add">
                        <AddIcon />
                    </Fab>
                </div>
                <SlidesFilters
                    axis='xy'
                    filters={filters}
                    handleFilterTypeChange={this.handleFilterTypeChange}
                    handleFilterDelete={this.handleFilterDelete}
                    handleFilterChange={this.handleFilterChange}
                    onSortStart={this.onDragStart}
                    onSortEnd={this.onDragEnd}
                    isSorting={isSorting}
                    useDragHandle
                    classes={classes}
                />
            </div>
            <Divider className={classes.divider}/>
            <FormControl margin='normal'>
                <Button variant='contained' color='primary' type='submit'>
                    Сохранить
                </Button>
            </FormControl>
        </form>;
    }
}

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(CategoryForm));
