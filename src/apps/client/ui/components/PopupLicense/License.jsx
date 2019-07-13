import React, { Component } from 'react';

import styles from './License.css';
import closeLicensePopup from '../../../actions/closeLicensePopup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Scroll from '../Scroll/Scroll';
import classNames from 'classnames';

const mapStateToProps = ({ popup }) => {
    return {
        licenseVisible: popup.licenseVisible
    };
};

const mapDispatchToProps = (dispatch) => ({
    closeLicensePopup: (payload) => dispatch(closeLicensePopup(payload))
});

class License extends Component {
    static propTypes = {
        closeLicensePopup: PropTypes.func.isRequired,
        licenseVisible: PropTypes.bool.isRequired
    };

    static defaultProps = {
        licenseVisible: false
    };

    handleCloseLicense = () => {
        this.props.closeLicensePopup();
    };

    componentWillReceiveProps (nextProps) {
        if (this.props.licenseVisible !== nextProps.licenseVisible) {
            document.body.style.overflowY = nextProps.licenseVisible ? 'hidden' : 'auto';
        }
    };

    render () {
        const { licenseVisible } = this.props;

        return <div className={classNames(styles.root, {
            [styles.rootVisible]: licenseVisible
        })}>
            <div className={classNames(styles.backing, {
                [styles.backingVisible]: licenseVisible
            })}/>
            <div className={classNames(styles.popupContent, {
                [styles.popupContentVisible]: licenseVisible
            })}>
                <div>
                    <div className={styles.headerContainer}>
                        <div className={styles.header}>лицензионное соглашение</div>
                        <div className={styles.closeButton} onClick={this.handleCloseLicense}>+</div>
                    </div>
                    <div className={styles.licenseText}>
                        <Scroll>
                            <div>
                                Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться.
                                Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение
                                шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при
                                простой дубликации "Здесь ваш текст.. Здесь ваш текст.. Здесь ваш текст.." Многие программы
                                электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию,
                                так что поиск по ключевым словам "lorem ipsum" сразу показывает, как много веб-страниц всё
                                ещё дожидаются своего настоящего рождения. За прошедшие годы текст Lorem Ipsum получил много
                                версий. Некоторые версии появились по ошибке, некоторые - намеренно (например, юмористические варианты).
                                Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться.
                                Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение
                                шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при
                                простой дубликации "Здесь ваш текст.. Здесь ваш текст.. Здесь ваш текст.." Многие программы
                                электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию,
                                так что поиск по ключевым словам "lorem ipsum" сразу показывает, как много веб-страниц всё
                                ещё дожидаются своего настоящего рождения. За прошедшие годы текст Lorem Ipsum получил много
                                версий. Некоторые версии появились по ошибке, некоторые - намеренно (например, юмористические варианты).
                                Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться.
                                Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение
                                шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при
                                простой дубликации "Здесь ваш текст.. Здесь ваш текст.. Здесь ваш текст.." Многие программы
                                электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию,
                                так что поиск по ключевым словам "lorem ipsum" сразу показывает, как много веб-страниц всё
                                ещё дожидаются своего настоящего рождения. За прошедшие годы текст Lorem Ipsum получил много
                                версий. Некоторые версии появились по ошибке, некоторые - намеренно (например, юмористические варианты).
                            </div>
                        </Scroll>

                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(License);
