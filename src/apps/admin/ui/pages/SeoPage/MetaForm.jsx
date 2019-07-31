import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Chip from '@material-ui/core/Chip';
import AutoRenew from '@material-ui/icons/AutorenewRounded';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';

const materialStyles = () => ({
    metaContainer: {
        width: '100%'
    },
    metaForm: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    metaAdd: {
        marginLeft: '12px',
        marginTop: '8px'
    },
    metaAddKeywords: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    metaKeyword: {
        margin: '4px',
        marginBottom: '20px'
    }
});

class MetaForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    render () {
        const { classes } = this.props;

        return <div className={classes.metaContainer}>
            <div className={classes.metaForm}>
                <TextField
                    label='Title'
                    value=''
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    required
                />
                <div className={classes.metaAdd}>
                    <Tooltip
                        title="Добавить значение по умолчанию"
                        placement='bottom'
                    >
                        <Fab
                            color="primary"
                            size='small'
                        >
                            <AutoRenew/>
                        </Fab>
                    </Tooltip>
                </div>
            </div>
            <div className={classes.metaForm}>
                <TextField
                    label='Description'
                    value=''
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    required
                />
                <div className={classes.metaAdd}>
                    <Tooltip
                        title="Добавить значение по умолчанию"
                        placement='bottom'
                    >
                        <Fab
                            color="primary"
                            size='small'
                        >
                            <AutoRenew/>
                        </Fab>
                    </Tooltip>
                </div>
            </div>
            <div className={classes.metaAddKeywords}>
                <TextField
                    label='Новое ключевое слово'
                    value=''
                    margin='normal'
                    variant='outlined'
                    fullWidth
                />
                <div className={classes.metaAdd}>
                    <Tooltip title='Добавить ключевое слово' placement='bottom'>
                        <Fab size='small' color='primary' aria-label="Add">
                            <AddIcon/>
                        </Fab>
                    </Tooltip>
                </div>
                <div className={classes.metaAdd}>
                    <Tooltip
                        title="Добавить ключевые слова по умолчанию"
                        placement='bottom'
                    >
                        <Fab
                            size='small'
                            color='primary'
                            aria-label="Add"
                        >
                            <AutoRenew/>
                        </Fab>
                    </Tooltip>
                </div>
            </div>
            <div className={classes.keywordsWrapper}>
                {
                    'keyword' &&
                        'keyword'.split(', ').map((option, i) => <Chip
                            key={i}
                            label={option}
                            variant='outlined'
                            color='primary'
                            className={classes.metaKeyword}
                        />)
                }
            </div>
            <FormControl margin='normal'>
                <Button variant='contained' color='primary' type='submit'>
                    Сохранить
                </Button>
            </FormControl>
        </div>;
    }
}

export default (withStyles(materialStyles)(MetaForm));
