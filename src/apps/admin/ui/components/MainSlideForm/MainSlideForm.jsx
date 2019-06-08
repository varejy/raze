import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { withStyles } from '@material-ui/core/styles';

import pick from '@tinkoff/utils/object/pick';

const SLIDE_VALUES = ['title', 'description', 'price', 'path'];

const materialStyles = theme => ({
    uploadInput: {
        display: 'none'
    },
    upload: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing.unit
    },
    uploadIcon: {
        marginLeft: theme.spacing.unit
    },
    imageWrapper: {
        marginTop: '20px',
        width: '100%'
    },
    image: {
        width: '100%'
    }
});

class MainSlideForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        editableSlideInfo: PropTypes.object.isRequired,
        onDone: PropTypes.func.isRequired
    };

    constructor (...args) {
        super(...args);

        const { editableSlideInfo } = this.props;
        const slide = {
            ...pick(SLIDE_VALUES, editableSlideInfo.slide)
        };

        this.state = {
            slide: slide,
            index: editableSlideInfo.index
        };
    }

    handleChange = prop => event => {
        this.setState({
            slide: {
                ...this.state.slide,
                [prop]: event.target.value
            }
        });
    };

    handleFilesUpload = (event) => {
        this.setState({
            slide: {
                ...this.state.slide,
                content: event.target.files[0],
                path: URL.createObjectURL(event.target.files[0])
            }
        });

        event.target.value = '';
    };

    handleSubmit = event => {
        event.preventDefault();

        const { slide, index } = this.state;

        this.props.onDone({
            slide,
            index
        });
    };

    render () {
        const { classes } = this.props;
        const { slide } = this.state;

        return <form onSubmit={this.handleSubmit}>
            <Typography variant='h5'>Редактирование слайда</Typography>
            <div className={classes.imageWrapper}>
                <img className={classes.image} src={slide.path} alt={slide.title}/>
            </div>
            <div>

            </div>
            <FormControl margin='normal'>
                <input
                    className={classes.uploadInput}
                    id='editUploadInput'
                    type='file'
                    accept='image/*'
                    onChange={this.handleFilesUpload}
                />
                <label htmlFor='editUploadInput'>
                    <Button variant='contained' component='span' color='default'>
                        Изменить фото слайда
                        <CloudUploadIcon className={classes.uploadIcon} />
                    </Button>
                </label>
            </FormControl>
            <TextField
                label='Название'
                value={slide.title}
                onChange={this.handleChange('title')}
                margin='normal'
                variant='outlined'
                fullWidth
            />
            <TextField
                label='Описание'
                value={slide.description}
                onChange={this.handleChange('description')}
                margin='normal'
                variant='outlined'
                fullWidth
            />
            <FormControl margin='normal'>
                <Button variant='contained' color='primary' type='submit'>
                    Сохранить
                </Button>
            </FormControl>
        </form>;
    }
}

export default withStyles(materialStyles)(MainSlideForm);
