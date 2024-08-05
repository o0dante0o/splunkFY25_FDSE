// src/GlobalState.jsx
import React, { createContext, useState } from 'react';

// Crear el contexto
export const GlobalContext = createContext();

// Crear el proveedor del contexto
export const GlobalProvider = ({ children }) => {
    const [searchResults, setSearchResults] = useState([]);

    return (
        <GlobalContext.Provider value={{ searchResults, setSearchResults }}>
            {children}
        </GlobalContext.Provider>
    );
};