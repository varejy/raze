import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class MainPage extends Component {
    render () {
        return <section>
            <NavLink to="/ProductsPage" activeClassName="selected">Shop</NavLink>
        </section>;
    }
}

export default MainPage;
