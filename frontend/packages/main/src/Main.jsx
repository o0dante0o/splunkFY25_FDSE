// src/Main.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Components/Navbar';
import AppRoutes from './Routes';
import { GlobalProvider } from './GlobalState';

const propTypes = {
    name: PropTypes.string,
};

const Main = ({ name = 'User' }) => {
    return (
        <GlobalProvider>
            <BrowserRouter>
                <div>
                    <Navbar />
                    <AppRoutes />
                </div>
            </BrowserRouter>
        </GlobalProvider>
    );
};

Main.propTypes = propTypes;

export default Main;