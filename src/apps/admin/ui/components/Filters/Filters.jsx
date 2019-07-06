import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ReorderIcon from '@material-ui/icons/Reorder';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

import remove from '@tinkoff/utils/array/remove';

import arrayMove from '../../../utils/arrayMove';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

const ButtonSortable = SortableHandle(({ imageClassName }) => (
    <ReorderIcon className={imageClassName}>reorder</ReorderIcon>
));

const FilterSortable = SortableElement(({ index, filter, isSorting, handleFilterDelete, handleFilterChange, classes }) => (
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
                        onChange={handleFilterChange('type', index)}
                        input={<OutlinedInput value={filter.type} labelWidth={45} name="Type" />}
                    >
                        <MenuItem value='checkbox'>Checkbox</MenuItem>
                        <MenuItem value='range'>Range</MenuItem>
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
    }
});

class Filters extends Component {
    static propTypes = {
        classes: PropTypes.object,
        onFilterChange: PropTypes.func,
        filters: PropTypes.array
    };

    static defaultProps = {
        filters: []
    };

    state = {
        filters: this.props.filters,
        isSorting: false
    };

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
            filters
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
        const { isSorting, filters } = this.state;

        if (filters !== this.props.filters) {
            this.props.onFilterChange(filters);
        };

        return <div className={classes.createFiltersWrapp}>
            <div className={classes.createFiltersHeader}>
                <Typography className={classes.filterTitle} variant='h5'>Фильтр</Typography>
                <Fab size="small" color='primary' onClick={this.handleFilterAdd} aria-label="Add">
                    <AddIcon />
                </Fab>
            </div>
            <SlidesFilters
                axis='xy'
                filters={filters}
                handleFilterDelete={this.handleFilterDelete}
                handleFilterChange={this.handleFilterChange}
                onSortStart={this.onDragStart}
                onSortEnd={this.onDragEnd}
                isSorting={isSorting}
                useDragHandle
                classes={classes}
            />
        </div>;
    }
}

export default withStyles(materialStyles)(Filters);
