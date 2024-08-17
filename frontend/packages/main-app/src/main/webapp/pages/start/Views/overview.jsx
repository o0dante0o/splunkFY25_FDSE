// src/Views/overview.jsx
import React, { useContext } from 'react';
import { GlobalContext } from '@splunk/global-state'; // Asegúrate de que la ruta sea correcta
import CardComponent from '@splunk/card-component'; // Asegúrate de que la ruta sea correcta

const Overview = () => {
    const { state, searchResults } = useContext(GlobalContext);
    const { overview, currentPath } = state;

    const dataToRender =
        searchResults && Object.keys(searchResults).length > 0 ? searchResults : overview;

    return (
        <div>
            {currentPath === '/' ? (
                Object.keys(dataToRender).map((key, index) => (
                    <CardComponent key={index} keyProp={key} value={dataToRender[key]} />
                ))
            ) : (
                <p>called from visualizations</p>
            )}
        </div>
    );
};

export default Overview;
