import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../GlobalState';
import TableComponent from '../Components/TableComponent';

const DataTables = () => {
    const { searchResults: searchContextResults, currentPath } = useContext(GlobalContext);
    const [initialData, setInitialData] = useState({});
    const [searchResults, setSearchResults] = useState({});

    useEffect(() => {
        // Fetch initial data from API
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/list?type=all'
                );
                const data = await response.json();
                setInitialData(data);
                setSearchResults(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (Object.keys(searchContextResults).length > 0) {
            setSearchResults(searchContextResults);
        } else {
            setSearchResults(initialData);
        }
    }, [searchContextResults, initialData]);

    const renderFilteredResults = () => {
        const keysToRender =
            currentPath === '/data-inventory'
                ? ['lookups', 'fields', 'index', 'sources']
                : ['dashboards', 'apps', 'reports', 'alerts'];

        const filteredResults = Object.keys(searchResults)
            .filter((key) => keysToRender.includes(key))
            .reduce((obj, key) => {
                obj[key] = searchResults[key];
                return obj;
            }, {});

        return filteredResults;
    };

    const to_render = renderFilteredResults();
    console.log('DataTables:', to_render);

    const transformedData = Object.keys(to_render).flatMap((kind) =>
        to_render[kind].map((item) => ({
            ...item,
            kind,
        }))
    );

    const columns = ['name', 'description', 'owner', 'custom_classification', 'tags'];

    return (
        <TableComponent
            data={transformedData}
            columns={columns}
            kindValues={Object.keys(to_render)}
        />
    );
};

export default DataTables;
