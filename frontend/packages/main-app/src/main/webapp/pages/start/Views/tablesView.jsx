// src/Views/overview.jsx
import React, { useContext } from 'react';
import { GlobalContext } from '@splunk/global-state'; // Asegúrate de que la ruta sea correcta

const Overview = () => {
    const { state, searchResults } = useContext(GlobalContext);
    const { list, currentPath } = state;

    const dataToRender =
        searchResults && Object.keys(searchResults).length > 0 ? searchResults : list;

    const collectionsForDataInventory = ['lookups', 'fields', 'index', 'sources'];
    const collectionsForOtherPaths = ['dashboards', 'apps', 'reports', 'alerts'];

    const renderData = (data, collections) => {
        return (
            <div>
                {collections.map(
                    (key, index) =>
                        data[key] && (
                            <div key={index}>
                                <strong>{key}:</strong> {JSON.stringify(data[key])}
                            </div>
                        )
                )}
            </div>
        );
    };

    return (
        <div>
            {currentPath === '/data-inventory'
                ? renderData(dataToRender, collectionsForDataInventory)
                : renderData(dataToRender, collectionsForOtherPaths)}
        </div>
    );
};

export default Overview;
