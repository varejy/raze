import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import pickBy from '@tinkoff/utils/object/pickBy';
import keys from '@tinkoff/utils/object/keys';
import reduce from '@tinkoff/utils/object/reduce';
import includes from '@tinkoff/utils/array/includes';
import compose from '@tinkoff/utils/function/compose';

import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import setFilteredProducts from '../../../actions/setFilteredProducts';

const materialStyles = {
    checkbox: {
        paddingTop: '0',
        paddingBottom: '0'
    }
};

const mapStateToProps = ({ application, products }) => {
    return {
        categories: application.categories,
        products: products.products
    };
};

const mapDispatchToProps = (dispatch) => ({
    setFilteredProducts: payload => dispatch(setFilteredProducts(payload))
});

class ProductFilters extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        setFilteredProducts: PropTypes.func.isRequired,
        categories: PropTypes.array,
        products: PropTypes.array
    };

    static defaultProps = {
        categories: [],
        products: []
    };

    constructor (...args) {
        super(...args);

        const state = this.getNewState();

        this.state = {
            ...state,
            filters: {}
        };

        this.setFilteredProducts();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.products !== this.props.products) {
            this.setFilteredProducts(nextProps);
        }
    }

    getNewState = (props = this.props) => {
        return {
            selectedCategories: {
                ...props.categories.reduce((result, category) => ({ ...result, [category.id]: true }), {}),
                none: true
            },
            selectedActivity: {
                active: true,
                hidden: true
            }
        };
    };

    setFilteredProducts = (props = this.props) => {
        const { products } = props;
        const { filters } = this.state;

        const filteredProducts = reduce((filteredProducts, filter) => {
            return filteredProducts.filter(filter);
        }, products, filters);

        this.props.setFilteredProducts(filteredProducts);
    };

    handleCategoriesChange = id => (event, value) => {
        const { selectedCategories, filters } = this.state;
        const newSelectedCategories = {
            ...selectedCategories,
            [id]: value
        };
        const selectedCategoriesIds = compose(
            keys,
            pickBy(value => !!value)
        )(newSelectedCategories);
        const newFilters = {
            ...filters,
            categories: product => {
                return includes(product.categoryId, selectedCategoriesIds) || !product.categoryId && includes('none', selectedCategoriesIds);
            }
        };

        this.setState({
            selectedCategories: newSelectedCategories,
            filters: newFilters
        }, this.handleFiltersChanged);
    };

    handleActivityChange = prop => (event, value) => {
        const { selectedActivity, filters } = this.state;
        const newSelectedActivity = {
            ...selectedActivity,
            [prop]: value
        };
        const selectedActivities = compose(
            keys,
            pickBy(value => !!value)
        )(newSelectedActivity);
        const newFilters = {
            ...filters,
            activity: product => {
                return product.hidden && includes('hidden', selectedActivities) || !product.hidden && includes('active', selectedActivities);
            }
        };

        this.setState({
            selectedActivity: newSelectedActivity,
            filters: newFilters
        }, this.handleFiltersChanged);
    };

    handleFiltersChanged = () => {
        this.setFilteredProducts();
    };

    renderCategories = () => {
        const { categories, classes } = this.props;
        const { selectedCategories } = this.state;

        return <div>
            <Typography variant='h6'>Категории</Typography>
            <List dense>
                { categories.map((category, i) =>
                    <ListItem key={i}>
                        <FormControlLabel
                            margin='dense'
                            control={
                                <Checkbox
                                    checked={selectedCategories[category.id]}
                                    onChange={this.handleCategoriesChange(category.id)}
                                    value={category.id}
                                    color='primary'
                                    className={classes.checkbox}
                                />
                            }
                            label={category.name}
                        />
                    </ListItem>) }
                <ListItem>
                    <FormControlLabel
                        control ={
                            <Checkbox
                                checked={selectedCategories['none']}
                                onChange={this.handleCategoriesChange('none')}
                                value='none'
                                color='primary'
                                className={classes.checkbox}
                            />
                        }
                        label='Без категории'
                    />
                </ListItem>
            </List>
        </div>;
    };

    renderActivity = () => {
        const { classes } = this.props;
        const { selectedActivity } = this.state;

        return <div>
            <Typography variant='h6'>Activity</Typography>
            <List dense>
                <ListItem>
                    <FormControlLabel
                        control ={
                            <Checkbox
                                checked={selectedActivity.active}
                                onChange={this.handleActivityChange('active')}
                                value='none'
                                color='primary'
                                className={classes.checkbox}
                            />
                        }
                        label='Active'
                    />
                </ListItem>
                <ListItem>
                    <FormControlLabel
                        control ={
                            <Checkbox
                                checked={selectedActivity.hidden}
                                onChange={this.handleActivityChange('hidden')}
                                value='none'
                                color='primary'
                                className={classes.checkbox}
                            />
                        }
                        label='Hidden'
                    />
                </ListItem>
            </List>
        </div>;
    };

    render () {
        return <div>
            <Typography variant='h5' gutterBottom>Фильтрация</Typography>
            {this.renderCategories()}
            {this.renderActivity()}
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(ProductFilters));
