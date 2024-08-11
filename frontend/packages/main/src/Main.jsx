import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Navbar from './Components/NavbarComponent';
import AppRoutes from './Routes';
import { GlobalProvider, GlobalContext } from './GlobalState';
import FetchDataComponent from './FetchData';

const propTypes = {
    name: PropTypes.string,
};

const MainContent = () => {
    const location = useLocation();
    const { setCurrentPath, searchResults, initialData, currentPath } = useContext(GlobalContext);

    useEffect(() => {
        setCurrentPath(location.pathname);
        console.log('Current Location:', location.pathname);
        console.log('Initial Data ======================\n\n\n',initialData, '\n\n\n Initial Data ======================');	
        console.log('Search Results ======================\n\n\n', searchResults, '\n\n\n Search Results ======================');
    }, 
    [location, setCurrentPath]);

    useEffect(() => {}, [currentPath, searchResults, initialData]);

    return (
        <div>
            <Navbar />
            <AppRoutes />
            <FetchDataComponent />
        </div>
    );
};

const Main = ({ name = 'User' }) => {
    return (
        <GlobalProvider>
            <BrowserRouter>
                <MainContent />
            </BrowserRouter>
        </GlobalProvider>
    );
};

Main.propTypes = propTypes;

export default Main;
