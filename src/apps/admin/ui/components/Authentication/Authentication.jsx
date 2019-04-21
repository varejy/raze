import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import styles from './Authentication.css';

export default class Authentication extends Component {
    state = {
        login: '',
        password: '',
        errors: {
            login: false,
            password: false
        }
    };

    handleChange = credential => event => {
        this.setState({
            [credential]: event.target.value,
            errors: {
                ...this.state.errors,
                [credential]: false
            }
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const { login, password } = this.state;

        this.setState({
            errors: {
                login: !login,
                password: !password
            }
        });
    };

    render () {
        const { login, password, errors } = this.state;

        return <div className={styles.container}>
            <h1 className={styles.title}>Вход</h1>
            <form className={styles.form} noValidate autoComplete='off' onSubmit={this.handleSubmit}>
                <TextField
                    label='Логин'
                    value={login}
                    onChange={this.handleChange('login')}
                    margin='normal'
                    variant='outlined'
                    error={errors.login}
                />
                <TextField
                    label='Пароль'
                    value={password}
                    onChange={this.handleChange('password')}
                    margin='normal'
                    variant='outlined'
                    error={errors.password}
                />
                <div className={styles.button}>
                    <Button variant='contained' color='primary' type='submit' fullWidth>
                        Войти
                    </Button>
                </div>
            </form>
        </div>;
    }
}
