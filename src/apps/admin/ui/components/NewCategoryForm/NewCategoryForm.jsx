import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class NewCategoryForm extends Component {
    state = {
        category: {}
    };

    handleSubmit = event => {
        event.preventDefault();
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
                value={category.name}
                onChange={this.handleChange('name')}
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

export default NewCategoryForm;
