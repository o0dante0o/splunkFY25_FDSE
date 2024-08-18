import React, { useContext } from 'react';
import { GlobalContext } from '@splunk/global-state';
import CardComponent from '@splunk/card-component';
import PlotComponent from '@splunk/plot-component';

const Overview = () => {
    const { state } = useContext(GlobalContext);
    const { overview, currentPath, searchResults } = state;

    const dataToRender =
        searchResults && Object.keys(searchResults).length > 0 ? searchResults : overview;

    const isFromSearchResults = searchResults && Object.keys(searchResults).length > 0;

    if (!currentPath) {
        return <p>Cargando datos...</p>; // Mensaje de carga
    }

    if (currentPath === '/visualizations') {
        return (
            <PlotComponent
                labels={Object.keys(dataToRender)}
                values={Object.values(dataToRender).map((value) =>
                    typeof value === 'object' ? Object.keys(value).length : value.length || value
                )}
            />
        );
    } else if (currentPath === '/' || currentPath === '/en-US/app/main-app/start') {
        return (
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
                        value={isFromSearchResults ? dataToRender[key].length : dataToRender[key]}
                    />
                ))}
            </div>
        );
    } else {
        return null;
    }
};

export default Overview;
