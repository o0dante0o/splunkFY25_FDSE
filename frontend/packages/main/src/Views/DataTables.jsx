import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../GlobalState';
import Table from '../Components/TableComponent';

const DataTables = () => {
    const { searchResults: searchContextResults, currentPath } = useContext(GlobalContext);
    const [initialData, setInitialData] = useState({});
    const [searchResults, setSearchResults] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/list?type=all'
                );
                const data = await response.json();
                setSearchResults(data);
                setInitialData(data);
                console.log('Initial data:', data);
                console
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

    const handleDelete = (id) => {
        setSearchResults((prevData) => 
            Object.keys(prevData).reduce((result, key) => {
                result[key] = prevData[key].filter((item) => item._id !== id);
                return result;
            }, {})
        );
    };

    const handleUpdate = (id, classification) => {
        setSearchResults((prevData) => 
            Object.keys(prevData).reduce((result, key) => {
                result[key] = prevData[key].map((item) => {
                    if (item._id === id) {
                        return {
                            ...item,
                            custom_classification: classification,
                        };
                    }
                    return item;
                });
                return result;
            }, {})
        );

    }
    const handleUpdateTags = (id, tags) => {
        setSearchResults((prevData) => 
            Object.keys(prevData).reduce((result, key) => {
                result[key] = prevData[key].map((item) => {
                    if (item._id === id) {
                        return {
                            ...item,
                            tags: tags,
                        };
                    }
                    return item;
                });
                return result;
            }, {})
        );
    }

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
        <Table 
            data={transformedData} 
            columns={columns} 
            kindValues={Object.keys(to_render)} 
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onUpdateTags={handleUpdateTags}
        />
    );
};

export default DataTables;
