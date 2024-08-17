// src/Views/overview.jsx
import React, { useContext } from 'react';
import { GlobalContext } from '@splunk/global-state'; // Asegúrate de que la ruta sea correcta
import CardComponent from '@splunk/card-component'; // Asegúrate de que la ruta sea correcta
import PlotComponent from '@splunk/plot-component'; // Asegúrate de que la ruta sea correcta
const Overview = () => {
    const { state, searchResults } = useContext(GlobalContext);
    const { overview, currentPath } = state;

    const dataToRender =
        searchResults && Object.keys(searchResults).length > 0 ? searchResults : overview;

    const isFromSearchResults = searchResults && Object.keys(searchResults).length > 0;

    return (
        <div>
            {currentPath === '/' ? (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '20px',
                    }}
                >
                    {Object.keys(dataToRender).map((key, index) => (
                        <CardComponent
                            key={index}
                            keyProp={key}
                            value={
                                isFromSearchResults ? dataToRender[key].length : dataToRender[key]
                            }
                        />
                    ))}
                </div>
            ) : (
                <PlotComponent
                    labels={Object.keys(dataToRender)}
                    values={Object.values(dataToRender).map((value) =>
                        typeof value === 'object'
                            ? Object.keys(value).length
                            : value.length || value
                    )}
                />
            )}
        </div>
    );
};

export default Overview;
