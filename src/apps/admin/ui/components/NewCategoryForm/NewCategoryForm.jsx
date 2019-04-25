import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { connect } from 'react-redux';
import saveCategory from '../../../services/saveCategory';

import noop from '@tinkoff/utils/function/noop';

const mapDispatchToProps = (dispatch) => ({
    saveCategory: payload => dispatch(saveCategory(payload))
});

class NewCategoryForm extends Component {
    static propTypes = {
        saveCategory: PropTypes.func.isRequired,
        onDone: PropTypes.func
    };

    static defaultProps = {
        onDone: noop
    };

    state = {
        category: {}
    };

    handleSubmit = event => {
        event.preventDefault();

        this.props.saveCategory(this.state.category)
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

    render () {
        const { category } = this.state;

        return <form onSubmit={this.handleSubmit}>
            <Typography variant='h5'>Добавление новой категории</Typography>
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
            <Button variant='contained' color='primary' type='submit'>
                Сохранить
            </Button>
        </form>;
    }
}

export default connect(null, mapDispatchToProps)(NewCategoryForm);
