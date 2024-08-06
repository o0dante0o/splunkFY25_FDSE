import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

// Crear el contexto
export const GlobalContext = createContext();

// Crear el proveedor del contexto
export const GlobalProvider = ({ children }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [currentPath, setCurrentPath] = useState('');

    return (
        <GlobalContext.Provider
            value={{ searchResults, setSearchResults, currentPath, setCurrentPath }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

GlobalProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
