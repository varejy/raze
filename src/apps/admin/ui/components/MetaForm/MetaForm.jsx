import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import trim from '@tinkoff/utils/string/trim';
import remove from '@tinkoff/utils/array/remove';
import updateSeo from '../../../services/updateSeo';
import getAllSeo from '../../../services/getAllSeo';
import { connect } from 'react-redux';
import find from '@tinkoff/utils/array/find';

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
const mapStateToProps = ({ seo }) => {
    return {
        allSeo: seo.allSeo
    };
};
const mapDispatchToProps = (dispatch) => ({
    updateSeo: payload => dispatch(updateSeo(payload)),
    getAllSeo: payload => dispatch(getAllSeo(payload))
});

class MetaForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        updateSeo: PropTypes.func.isRequired,
        getAllSeo: PropTypes.func.isRequired,
        page: PropTypes.string.isRequired
    };

    static defaultProps = {
        allSeo: []
    };

    constructor (...args) {
        super(...args);

        const { page } = this.props;

        this.state = {
            seo: this.getSeoData(this.props),
            keywordsInput: '',
            page: page
        };
    }

    getSeoData = (props) => {
        const { page, allSeo } = props;
        const seoPage = find(seoPage => seoPage.name === page, allSeo);
        const newSeo = {
            name: page,
            metaTitle: '',
            metaDescription: '',
            keywords: ''
        };
        return !seoPage ? newSeo : seoPage;
    };

    handleKeywordChange = () => event => {
        this.setState({
            keywordsInput: event.target.value,
            seo: {
                ...this.state.seo,
                keywords: this.state.seo.keywords === undefined ? '' : this.state.seo.keywords
            }
        });
    };

    handleKeywordAdd = () => {
        const { seo, keywordsInput } = this.state;
        const keyword = trim(keywordsInput);

        if (!keyword) {
            return;
        }

        const keywordsArray = seo.keywords !== '' ? seo.keywords.split(', ') : [];
        const newKeywords = [...keywordsArray, keyword];

        this.setState({
            seo: {
                ...this.state.seo,
                keywords: newKeywords.join(', ')
            },
            keywordsInput: ''
        });
    };

    handleKeywordDelete = (i) => () => {
        const { seo } = this.state;
        const keywordsArray = seo.keywords.split(', ');
        const newKeywords = remove(i, 1, keywordsArray);

        this.setState({
            seo: {
                ...this.state.seo,
                keywords: newKeywords.join(', ')
            }
        });
    };

    getSeoPayload = (
        {
            name,
            metaTitle,
            metaDescription,
            keywords
        }) => {
        return {
            name,
            metaTitle,
            metaDescription,
            keywords
        };
    };

    handleChange = prop => event => {
        this.setState({
            ...this.state,
            seo: {
                ...this.state.seo,
                [prop]: event.target.value
            }
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        const { seo } = this.state;
        const seoPayload = this.getSeoPayload(seo);

        this.props.updateSeo(seoPayload).then(this.props.getAllSeo());
    };

    render () {
        const { classes } = this.props;
        const { keywordsInput, seo } = this.state;

        return <div className={classes.metaContainer}>
            <form onSubmit={this.handleSubmit}>
                <div className={classes.metaForm}>
                    <TextField
                        label='Title'
                        value={seo.metaTitle}
                        margin='normal'
                        variant='outlined'
                        fullWidth
                        required
                        onChange={this.handleChange('metaTitle')}
                    />
                </div>
                <div className={classes.metaForm}>
                    <TextField
                        label='Description'
                        value={seo.metaDescription}
                        margin='normal'
                        variant='outlined'
                        fullWidth
                        required
                        onChange={this.handleChange('metaDescription')}
                    />
                </div>
                <div className={classes.metaAddKeywords}>
                    <TextField
                        label='Новое ключевое слово'
                        value={keywordsInput}
                        margin='normal'
                        variant='outlined'
                        fullWidth
                        onChange={this.handleKeywordChange()}
                    />
                    <div className={classes.metaAdd}>
                        <Tooltip title='Добавить ключевое слово' placement='bottom'>
                            <Fab size='small' color='primary' aria-label="Add" onClick={this.handleKeywordAdd}>
                                <AddIcon/>
                            </Fab>
                        </Tooltip>
                    </div>
                </div>
                <div className={classes.keywordsWrapper}>
                    {
                        seo.keywords &&
                        seo.keywords.split(', ').map((option, i) => <Chip
                            key={i}
                            label={option}
                            variant='outlined'
                            color='primary'
                            className={classes.metaKeyword}
                            onDelete={this.handleKeywordDelete(i)}
                        />)
                    }
                </div>
                <FormControl margin='normal'>
                    <Button variant='contained' color='primary' type='submit'>
                    Сохранить
                    </Button>
                </FormControl>
            </form>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(MetaForm));
