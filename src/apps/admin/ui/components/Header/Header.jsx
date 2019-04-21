import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { matchPath } from 'react-router';

import routes from '../../../constants/routes';

import { withRouter, Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';

import propOr from '@tinkoff/utils/object/propOr';
import find from '@tinkoff/utils/array/find';

class Header extends Component {
    static propTypes = {
        location: PropTypes.object
    };

    static defaultProps = {
        location: {}
    };

    state = {
        menuShowed: false
    };

    getHeaderTitle = () => {
        const { location: { pathname } } = this.props;
        const match = find(route => matchPath(pathname, route), routes);

        return propOr('title', 'Такой страницы не существует', match);
    };

    handleToggle = () => {
        this.setState({
            menuShowed: !this.state.menuShowed
        });
    };

    handleClose = () => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }

        this.setState({ menuShowed: false });
    };

    render () {
        const { menuShowed } = this.state;

        return <AppBar position='static'>
            <Toolbar>
                <IconButton
                    color='inherit'
                    aria-label='Menu'
                    onClick={this.handleToggle}
                    buttonRef={node => {
                        this.anchorEl = node;
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Popper open={menuShowed} anchorEl={this.anchorEl} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <MenuList>
                                        {routes.map((route, i) =>
                                            <MenuItem key={i} component={Link} onClick={this.handleClose} to={route.path}>{route.title}</MenuItem>)}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
                <Typography variant='h6' color='inherit'>
                    {this.getHeaderTitle()}
                </Typography>
            </Toolbar>
        </AppBar>;
    }
}

export default withRouter(Header);
