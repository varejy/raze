import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import logout from '../../../services/logout';
import authenticate from '../../../services/authenticate';
import changeCredentials from '../../../services/changeCredentials';

const EMAIL_PATTERN = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i; // eslint-disable-line no-control-regex, no-useless-escape, max-len

const materialStyles = (theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 64px)'
    },
    container: {
        width: '500px',
        marginTop: '-40px'
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    form: {
        width: '400px'
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    },
    margin: {
        margin: theme.spacing.unit
    },
    errorPoint: {
        marginTop: '10px',
        fontSize: '14px'
    }
});

const mapDispatchToProps = (dispatch) => ({
    logout: payload => dispatch(logout(payload)),
    authenticate: payload => dispatch(authenticate(payload)),
    changeCredentials: (...payload) => dispatch(changeCredentials(...payload))
});

class Credentials extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        authenticate: PropTypes.func.isRequired,
        changeCredentials: PropTypes.func.isRequired
    };

    static defaultProps = {};

    state = {
        authentication: {
            login: '',
            password: ''
        },
        newCredentials: {
            login: '',
            password: '',
            password2: ''
        },
        activeStep: 0,
        authFailed: false,
        newCredentialsErrors: []
    };

    newCredentialsValidators = [
        // ({ login }) => /[а-яА-Я]/g.test(login) ? 'Логин не должен содержать кириллицу' : null,
        // ({ login }) => / /g.test(login) ? 'Логин не должен содержать пробелов' : null,
        // ({ password }) => password.length >= 8 ? null : 'Длина пароля должна быть не меньше восьми',
        // ({ password }) => /[а-яА-Я]/g.test(password) ? 'Пароль не должен содержать кириллицу' : null,
        // ({ password }) => / /g.test(password) ? 'Пароль не должен содержать пробелов' : null,
        // ({ password }) => /[0-9]/g.test(password) ? null : 'В пароле должны использоваться цифры',
        // ({ password, password2 }) => password === password2 ? null : 'Пароли должны совпадать',
        // ({ email }) => EMAIL_PATTERN.test(email) ? null : 'Введите валидный имейл'
    ];

    validateCredentials = credentials => {
        const errors = [];

        this.newCredentialsValidators.forEach(validator => {
            const error = validator(credentials);

            error && errors.push(error);
        });

        return errors;
    };

    getSteps = () => [
        'Аутентификация',
        'Изменение учетных данных'
    ];

    getContentByStep = activeStep => {
        switch (activeStep) {
        case 0:
            return this.renderAuthenticationForm();
        case 1:
            return this.renderNewCredentialsForm();
        }
    };

    handleAuthenticationChange = credential => event => {
        this.setState({
            authentication: {
                ...this.state.authentication,
                [credential]: event.target.value
            }
        });
    };

    handleNewCredentialsChange = credential => event => {
        this.setState({
            newCredentials: {
                ...this.state.newCredentials,
                [credential]: event.target.value
            }
        });
    };

    handleAuthenticationSubmit = () => {
        event.preventDefault();

        const { login, password } = this.state.authentication;

        const credentials = {
            login: login.trim(),
            password: password.trim()
        };

        this.props.authenticate(credentials)
            .then(() => {
                this.setState({
                    activeStep: 1,
                    newCredentials: {
                        login,
                        password: '',
                        password2: ''
                    }
                });
            })
            .catch(() => {
                this.setState({
                    authentication: {
                        login,
                        password: ''
                    },
                    authFailed: true
                });
            });
    };

    handleNewCredentialsSubmit = () => {
        event.preventDefault();

        const { newCredentials: { login, password, password2, email }, authentication } = this.state;
        const newCredentials = {
            login: login.trim(),
            password: password.trim(),
            email: email.trim()
        };
        const errors = this.validateCredentials({
            ...newCredentials,
            password2: password2.trim()
        });

        this.setState({
            newCredentialsErrors: errors
        });

        if (errors.length) {
            return;
        }

        this.props.changeCredentials({
            oldCredentials: {
                login: authentication.login.trim(),
                password: authentication.password.trim()
            },
            newCredentials
        })
            .then(() => {
                this.props.logout();
            })
            .catch(() => {
                this.setState({
                    authentication: {
                        login,
                        password: '',
                        password2: ''
                    }
                });
            });
    };

    handleHideFailMessage = () => {
        this.setState({
            authFailed: false
        });
    };

    renderAuthenticationForm = () => {
        const { classes } = this.props;
        const { authentication, authFailed } = this.state;

        return <div>
            <form className={classes.form} onSubmit={this.handleAuthenticationSubmit}>
                <TextField
                    label='Логин'
                    value={authentication.login}
                    onChange={this.handleAuthenticationChange('login')}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    InputLabelProps={{
                        shrink: !!authentication.login
                    }}
                    required
                />
                <TextField
                    label='Пароль'
                    value={authentication.password}
                    onChange={this.handleAuthenticationChange('password')}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    required
                    InputLabelProps={{
                        shrink: !!authentication.password
                    }}
                    type='password'
                />
                <Button variant='contained' color='primary' type='submit' fullWidth>
                    Войти
                </Button>
            </form>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                onClose={this.handleHideFailMessage}
                open={authFailed}
                autoHideDuration={2000}
            >
                <SnackbarContent
                    className={classNames(classes.error, classes.margin)}
                    message={
                        <span id='client-snackbar' className={classes.message}>
                            <ErrorIcon className={classNames(classes.icon, classes.iconVariant)} />
                            Вы ввели неправильный логин или пароль
                        </span>
                    }
                />
            </Snackbar>
        </div>;
    };

    renderNewCredentialsForm = () => {
        const { classes } = this.props;
        const { newCredentials, newCredentialsErrors } = this.state;

        return <div>
            <form className={classes.form} onSubmit={this.handleNewCredentialsSubmit}>
                <TextField
                    label='Логин'
                    value={newCredentials.login}
                    onChange={this.handleNewCredentialsChange('login')}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    InputLabelProps={{
                        shrink: !!newCredentials.login
                    }}
                    required
                />
                <TextField
                    label='Пароль'
                    value={newCredentials.password}
                    onChange={this.handleNewCredentialsChange('password')}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    required
                    InputLabelProps={{
                        shrink: !!newCredentials.password
                    }}
                    type='password'
                />
                <TextField
                    label='Повторите пароль'
                    value={newCredentials.password2}
                    onChange={this.handleNewCredentialsChange('password2')}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    required
                    InputLabelProps={{
                        shrink: !!newCredentials.password2
                    }}
                    type='password'
                />
                <TextField
                    label='Email'
                    value={newCredentials.email}
                    onChange={this.handleNewCredentialsChange('email')}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    required
                    InputLabelProps={{
                        shrink: !!newCredentials.email
                    }}
                />
                <Button variant='contained' color='primary' type='submit' fullWidth>
                    Сменить
                </Button>
                { newCredentialsErrors.map((error, i) => <Typography className={classes.errorPoint} color='error' key={i}>&bull; {error}</Typography>) }
            </form>
        </div>;
    };

    render () {
        const { classes } = this.props;
        const { activeStep } = this.state;
        const steps = this.getSteps();

        return <div className={classes.root}>
            <div className={classes.container}>
                <Stepper nonLinear activeStep={activeStep}>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel completed={index < activeStep}>
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div className={classes.content}>
                    {this.getContentByStep(activeStep)}
                </div>
            </div>
        </div>;
    }
}

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(Credentials));
