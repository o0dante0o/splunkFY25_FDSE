import React, { useContext } from 'react';
import { GlobalContext } from '@splunk/global-state';
import TableComponent from '@splunk/table-component';

/**
 * filterListBySearchResults
 *
 * Filters the list based on search results.
 *
 * @param {Object} list - The original list of items.
 * @param {Object} searchResults - The search results to filter by.
 *
 * @returns {Object} The filtered list.
 */
const filterListBySearchResults = (list, searchResults) => {
    const filteredList = {};

    Object.keys(list).forEach((key) => {
        if (searchResults[key]) {
            filteredList[key] = list[key].filter((item) => {
                const match = searchResults[key].some((result) => result._id === item._id);
                return match;
            });
        } else {
            filteredList[key] = [];
        }
    });
    return filteredList;
};

/**
 * TablesView
 *
 * A component that renders tables based on the current path and search results.
 *
 * @returns {JSX.Element} The rendered tables view component.
 */
const TablesView = () => {
    const { state } = useContext(GlobalContext);
    const { list, currentPath, searchResults } = state;

    // Display a loading message if the current path is not set
    if (!currentPath) {
        return <p>Loading data...</p>;
    }

    // Determine the data to render based on whether there are search results
    const dataToRender =
        searchResults && Object.keys(searchResults).length > 0
            ? filterListBySearchResults(list, searchResults)
            : list;

    const collectionsForDataInventory = ['lookups', 'fields', 'index', 'sources'];
    const collectionsForOtherPaths = ['dashboards', 'apps', 'reports', 'alerts'];

    const columns = ['name', 'description', 'owner', 'custom_classification', 'tags'];

    /**
     * getFilteredData
     *
     * Filters the data based on the specified collections.
     *
     * @param {Object} data - The data to be filtered.
     * @param {Array<string>} collections - The collections to filter by.
     *
     * @returns {Object} The filtered data.
     */
    const getFilteredData = (data, collections) => {
        return collections.reduce((acc, key) => {
            if (data[key]) {
                acc[key] = data[key].map((item) => ({ ...item, kind: key }));
            }
            return acc;
        }, {});
    };

    let filteredData = {};
    if (currentPath === '/data-inventory') {
        filteredData = getFilteredData(dataToRender, collectionsForDataInventory);
    } else if (currentPath === '/knowledge-objects') {
        filteredData = getFilteredData(dataToRender, collectionsForOtherPaths);
    }

    const transformedData = Object.keys(filteredData).flatMap((kind) =>
        filteredData[kind].map((item) => ({
            ...item,
            kind,
        }))
    );

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '20px',
            }}
        >
            <TableComponent
                data={transformedData}
                columns={columns}
                kindValues={Object.keys(filteredData)}
            />
        </div>
    );
};

export default TablesView;
