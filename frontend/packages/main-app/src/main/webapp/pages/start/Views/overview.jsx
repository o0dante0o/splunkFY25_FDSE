import React, { useContext } from 'react';
import { GlobalContext } from '@splunk/global-state';
import CardComponent from '@splunk/card-component';
import PlotComponent from '@splunk/plot-component';

/**
 * Overview
 *
 * A component that renders an overview of data based on the current path.
 *
 * @returns {JSX.Element} The rendered overview component.
 */
const Overview = () => {
    const { state } = useContext(GlobalContext);
    const { overview, currentPath, searchResults } = state;

    // Determine the data to render based on whether there are search results
    const dataToRender =
        searchResults && Object.keys(searchResults).length > 0 ? searchResults : overview;

    // Check if the data is from search results
    const isFromSearchResults = searchResults && Object.keys(searchResults).length > 0;

    // Display a loading message if the current path is not set
    if (!currentPath) {
        return <p>Cargando datos...</p>; // Loading message
    }

    // Render a plot component if the current path is '/visualizations'
    if (currentPath === '/visualizations') {
        return (
            <PlotComponent
                labels={Object.keys(dataToRender)}
                values={Object.values(dataToRender).map((value) =>
                    typeof value === 'object' ? Object.keys(value).length : value.length || value
                )}
            />
        );
    }
    // Render card components if the current path is the home or start page
    else if (currentPath === '/' || currentPath === '/en-US/app/main-app/start') {
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
    }
    // Return null for other paths
    else {
        return null;
    }
};

export default Overview;
