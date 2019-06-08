import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import getMainSlides from '../../../services/getMainSlides';
import updateSlides from '../../../services/updateSlides';

import map from '@tinkoff/utils/array/map';
import remove from '@tinkoff/utils/array/remove';
import equal from '@tinkoff/utils/is/equal';
import find from '@tinkoff/utils/array/find';
import arrayMove from '../../../utils/arrayMove';

const SLIDE_WIDTH = 1500;
const SLIDE_HEIGHT = 500;

const checkWrongDimensions = slides => {
    const wrongFile = find(file => file.wrongDimensions, slides);

    return !!wrongFile;
};

const materialStyles = theme => ({
    root: {
        padding: '20px'
    },
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
    filesList: {
        overflow: 'auto'
    },
    fileItem: {
        position: 'relative',
        userSelect: 'none',
        padding: '16px',
        float: 'left',
        width: '200px',
        cursor: 'grab',
        '&:hover $fileItemDeleteContainer': {
            visibility: 'visible'
        }
    },
    fileItemSorting: {
        '&:hover $fileItemDeleteContainer': {
            visibility: 'hidden'
        }
    },
    fileImage: {
        width: '100%'
    },
    fileImageError: {
        outline: 'solid 4px #f44336'
    },
    fileItemDeleteContainer: {
        position: 'absolute',
        right: '0',
        top: '0',
        visibility: 'hidden',
        background: 'white',
        borderRadius: '100%'
    },
    warning: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '20px'
    },
    warningIcon: {
        color: '#ffae42',
        marginRight: '10px'
    },
    errorIcon: {
        color: '#f44336',
        marginRight: '10px'
    },
    warningText: {
        fontSize: '16px'
    },
    loader: {
        height: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitButtonNoSlides: {
        marginTop: '16px'
    }
});

const Image = SortableHandle(({ imageClassName, src, onLoad }) => (
    <img className={imageClassName} src={src} onLoad={onLoad} />
));

const SlidePreview = SortableElement(({ slide, index, classes, onFileDelete, onFileLoad, isSorting }) =>
    <div className={classNames(classes.fileItem, {
        [classes.fileItemSorting]: isSorting
    })}>
        <div className={classes.fileItemDeleteContainer}>
            <IconButton
                aria-label='Delete'
                onClick={onFileDelete(index)}
            >
                <DeleteIcon />
            </IconButton>
        </div>
        <Image src={slide.path} onLoad={onFileLoad(index)} imageClassName={classNames(classes.fileImage, {
            [classes.fileImageError]: slide.wrongDimensions
        })} />
    </div>);

const SlidesPreviews = SortableContainer(({ slides, classes, ...rest }) =>
    <div className={classes.filesList}>
        {slides.map((slide, i) => <SlidePreview
            key={i}
            index={i}
            slide={slide}
            classes={classes}
            {...rest}
        />)}
    </div>);

const mapStateToProps = ({ application }) => {
    return {
        slides: application.mainSlides
    };
};

const mapDispatchToProps = (dispatch) => ({
    getMainSlides: payload => dispatch(getMainSlides(payload)),
    updateSlides: payload => dispatch(updateSlides(payload))
});

class MainSlider extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getMainSlides: PropTypes.func.isRequired,
        updateSlides: PropTypes.func.isRequired,
        slides: PropTypes.array
    };

    static defaultProps = {
        slides: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            slides: this.props.slides.map(slide => ({
                path: slide.path || '/wrong-path',
                showed: slide.showed
            })),
            removedSlides: [],
            isSorting: false,
            loading: true,
            disabled: true
        };

        this.slidesPaths = this.state.slides.map(slide => slide.path);
    }

    componentDidMount () {
        this.props.getMainSlides()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.slides !== this.props.slides) {
            this.setState({
                slides: nextProps.slides,
                disabled: true
            });

            this.slidesPaths = nextProps.slides.map(slide => slide.path);
        }
    }

    onDragStart = () => {
        this.setState({
            isSorting: true
        });
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        this.setState({
            slides: arrayMove(this.state.slides, oldIndex, newIndex),
            isSorting: false
        }, this.handleSlidesChanged);
    };

    handleSlidesChanged = () => {
        const newSlidesPaths = this.state.slides.map(slide => slide.path);

        this.setState({
            disabled: equal(this.slidesPaths, newSlidesPaths)
        });
    };

    handleFilesUpload = (event) => {
        const newFiles = map(file => ({
            content: file,
            path: URL.createObjectURL(file),
            showed: true
        }), event.target.files);

        const slides = [...this.state.slides, ...newFiles];

        this.setState({
            slides
        }, this.handleSlidesChanged);

        event.target.value = '';
    };

    handleFileLoad = i => (event) => {
        if (event.target.naturalWidth !== SLIDE_WIDTH || event.target.naturalHeight !== SLIDE_HEIGHT) {
            const { slides } = this.state;

            slides[i].wrongDimensions = true;

            this.setState({
                slides
            });
        }
    };

    handleFileDelete = i => () => {
        const { slides, removedSlides } = this.state;

        if (slides[i].path) {
            removedSlides.push(slides[i]);
        }

        this.setState({
            slides: remove(i, 1, slides),
            removedSlides
        }, this.handleSlidesChanged);
    };

    handleSubmit = event => {
        event.preventDefault();

        const { slides, removedSlides } = this.state;
        const formData = new FormData();
        const cleanedSlides = slides.map(slide => {
            const isOld = !slide.content;

            return {
                showed: slide.showed,
                old: isOld,
                path: isOld && slide.path
            };
        });

        slides.forEach((file, i) => {
            if (file.content) {
                formData.append(`slide-file-${i}`, file.content);
            }
        });

        formData.append('removedSlides', JSON.stringify(removedSlides));
        formData.append('slides', JSON.stringify(cleanedSlides));

        this.props.updateSlides(formData);
    };

    render () {
        const { classes } = this.props;
        const { slides, isSorting, loading, disabled } = this.state;
        const isWrongDimensions = checkWrongDimensions(slides);

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress />
            </div>;
        }

        return <div className={classes.root}>
            <form onSubmit={this.handleSubmit}>
                <Typography variant='h6'>Фотографии</Typography>
                <div className={classes.upload}>
                    <input
                        className={classes.uploadInput}
                        id='uploadInput'
                        type='file'
                        accept='image/*'
                        onChange={this.handleFilesUpload}
                        multiple
                    />
                    <label htmlFor='uploadInput'>
                        <Button variant='contained' component='span' color='default' className={classes.uploadButton}>
                            Загрузить
                            <CloudUploadIcon className={classes.uploadIcon} />
                        </Button>
                    </label>
                    <div className={classes.warning}>
                        <WarningIcon className={classNames(classes.warningIcon, {
                            [classes.errorIcon]: isWrongDimensions
                        })} color={isWrongDimensions ? 'error' : 'inherit'} fontSize='small'/>
                        <Typography className={classes.warningText} color={isWrongDimensions ? 'error' : 'inherit'} variant='h6'>
                            Ширина фото дожна быть {SLIDE_WIDTH}px, а высота {SLIDE_HEIGHT}px
                        </Typography>
                    </div>
                </div>
                <SlidesPreviews
                    axis='xy'
                    classes={classes}
                    slides={slides}
                    onFileDelete={this.handleFileDelete}
                    onFileLoad={this.handleFileLoad}
                    onSortStart={this.onDragStart}
                    onSortEnd={this.onDragEnd}
                    isSorting={isSorting}
                    useDragHandle
                />
                <Button
                    className={classNames({
                        [classes.submitButtonNoSlides]: !slides.length
                    })}
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={disabled}
                >
                    Сохранить
                </Button>
            </form>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(MainSlider));
