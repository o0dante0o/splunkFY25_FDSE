// Main.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Components/Navbar';
import AppRoutes from './Routes';

const propTypes = {
    name: PropTypes.string,
};

const Main = ({ name = 'User' }) => {
    return (
        <BrowserRouter>
            <div>
                <Navbar />
                <AppRoutes />
            </div>
        </BrowserRouter>
    );
};

Main.propTypes = propTypes;

export default Main;