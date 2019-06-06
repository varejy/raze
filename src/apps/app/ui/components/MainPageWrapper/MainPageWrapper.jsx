import React, { Component } from 'react';
import Header from '../Header/Header.jsx';
import Carousel from '../Carousel/Carousel.jsx';
import AboutUsBanner from '../AboutUsBanner/AboutUsBanner.jsx';
import Footer from '../Footer/Footer.jsx';

class MainPageWrapper extends Component {
    render () {
        return <section>
            <Header/>
            <Carousel/>
            <AboutUsBanner/>
            <Footer/>
        </section>;
    }
}

export default MainPageWrapper;
