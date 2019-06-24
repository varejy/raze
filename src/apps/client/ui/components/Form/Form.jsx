import React, { Component } from 'react';
import PropTypes from 'prop-types';

import noop from '@tinkoff/utils/function/noop';
import isObject from '@tinkoff/utils/is/object';
import forEach from '@tinkoff/utils/array/each';
import any from '@tinkoff/utils/array/any';
import pathOr from '@tinkoff/utils/object/pathOr';
import map from '@tinkoff/utils/object/map';

import { connect } from 'react-redux';

import validatorsList from './validators';

import styles from './Form.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class Form extends Component {
    static propTypes = {
        schema: PropTypes.object,
        initialValues: PropTypes.object,
        onChange: PropTypes.func,
        onSubmit: PropTypes.func,
        langMap: PropTypes.object
    };

    static defaultProps = {
        schema: {},
        initialValues: {},
        onChange: noop,
        onSubmit: noop
    };

    constructor (...args) {
        super(...args);

        this.state = {
            values: this.props.initialValues,
            validationMessages: {},
            langMap: {}
        };
        this.validators = this.getFieldsValidators();
    }

    getFieldsValidators = (props = this.props) => props.schema.fields
        .reduce((validators, field) => {
            if (!field.validators) {
                return validators;
            }

            return {
                ...validators,
                [field.name]: field.validators
            };
        }, {});

    getValidatorsTexts = (props = this.props) => pathOr(['form', 'validators'], {}, props.langMap);

    componentWillReceiveProps (nextProps) {
        if (nextProps.langMap !== this.props.langMap) {
            this.validators = this.getFieldsValidators(nextProps);

            const validatorsTexts = this.getValidatorsTexts(nextProps);
            const validationMessages = map((validationMessage, fieldName) => {
                if (!validationMessage) {
                    return validationMessage;
                }

                return this.validateField(fieldName, validatorsTexts);
            }, this.state.validationMessages);

            this.setState({
                validationMessages
            });
        }
    }

    createField = (field, i) => {
        const { values, validationMessages } = this.state;
        const FieldComponent = field.component;
        const validationMessage = validationMessages[field.name];
        const fieldProps = {
            onChange: this.handleFieldChange(field.name),
            onBlur: this.handleFieldBlur(field.name),
            name: field.name,
            value: values[field.name],
            isRequired: any(validator => validator.name === 'required', field.validators || []),
            validationMessage,
            schema: field,
            key: i
        };

        return <div className={styles.field} key={i}>
            <FieldComponent {...fieldProps} />
            { validationMessage && <div className={styles.validationMessage}>{validationMessage}</div> }
        </div>;
    };

    validateForm = () => {
        const validatorsTexts = this.getValidatorsTexts();
        const validationMessages = {};
        let isValid = true;

        this.props.schema.fields.map((field) => {
            const validationMessage = this.validateField(field.name, validatorsTexts);

            if (validationMessage) {
                isValid = false;
            }

            validationMessages[field.name] = validationMessage;
        });

        this.setState({
            validationMessages
        });

        return isValid;
    };

    validateField = (filedName, validatorsTexts) => {
        const { values } = this.state;
        const validators = this.validators[filedName] || [];
        let validationMessage = '';

        forEach(({ name, options }) => {
            const validatorOptions = isObject(options) ? options : {};
            const validator = validatorsList[name];

            if (validator && !validationMessage) {
                validationMessage = validator(values[filedName], validatorOptions, validatorsTexts[name]);
            }
        }, validators);

        return validationMessage;
    };

    handleFieldChange = (name) => (value) => {
        const changes = {
            [name]: value
        };
        const { values, validationMessages } = this.state;
        const newValues = {
            ...values,
            ...changes
        };

        this.props.onChange(values, changes);
        this.setState({
            values: newValues,
            validationMessages: {
                ...validationMessages,
                [name]: ''
            }
        });
    };

    handleFieldBlur = (name) => () => {
        const validatorsTexts = this.getValidatorsTexts();
        const { validationMessages } = this.state;
        const validationMessage = this.validateField(name, validatorsTexts);

        this.setState({
            validationMessages: {
                ...validationMessages,
                [name]: validationMessage
            }
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        const isValid = this.validateForm();

        isValid && this.props.onSubmit(this.state.values);
    };

    render () {
        const { schema } = this.props;

        return <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={this.handleSubmit}>
                { schema.fields.map((field, i) => this.createField(field, i)) }
            </form>
        </div>;
    }
}

export default connect(mapStateToProps)(Form);
