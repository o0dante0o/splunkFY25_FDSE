// src/Components/SearchComponent.jsx
import React, { useEffect, useRef, useState, useContext } from 'react';
import Search from '@splunk/react-ui/Search';
import { GlobalContext } from '@splunk/global-state';
import Typesense from 'typesense';

function SearchComponent() {
    const { setSearchResults } = useContext(GlobalContext);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState('');
    const fetchOptions = useRef(null);

    const typesense = new Typesense.Client({
        nodes: [
            {
                host: 'fevqlxr7zw9gh45bp-1.a1.typesense.net',
                port: '443',
                protocol: 'https',
            },
        ],
        apiKey: 'jpmBZkUymyxRxKOzxiwVS7b2JG8Ou2iS', // Search-Only API Key
        connectionTimeoutSeconds: 2,
    });

    const handleFetch = async (searchValue = '') => {
        setValue(searchValue);
        if (searchValue.length > 2) {
            console.log('Searching for:', searchValue);
            console.log('Search Options:', options);
            console.log('value', value);
            setIsLoading(true);
            try {
                const searchParameters = {
                    q: searchValue,
                    query_by: 'name,description,owner,custom_classification,tags',
                };
                const collections = [
                    'sources',
                    'reports',
                    'lookups',
                    'index',
                    'fields',
                    'dashboards',
                    'apps',
                    'alerts',
                ];

                let allResults = {};

                for (const collectionName of collections) {
                    try {
                        const searchResults = await typesense
                            .collections(collectionName)
                            .documents()
                            .search(searchParameters);

                        allResults[collectionName] = searchResults.hits.map((hit) => hit.document);
                    } catch (searchError) {
                        console.error(
                            `Error searching in collection ${collectionName}:`,
                            searchError
                        );
                    }
                }

                const filteredResults = Object.keys(allResults)
                    .filter((key) => allResults[key].length > 0)
                    .reduce((obj, key) => {
                        obj[key] = allResults[key];
                        return obj;
                    }, {});

                if (fetchOptions.current) {
                    console.log('Filtered Search Results:', filteredResults);
                    setOptions(filteredResults);
                    setSearchResults(filteredResults);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
                setIsLoading(false);
                setSearchResults([]); // Set global state to empty list on error
            }
        } else {
            setOptions([]);
            setSearchResults([]); // Set global state to empty list if search value is too short
        }
    };

    const handleChange = (e, { value: searchValue }) => {
        handleFetch(searchValue);
    };

    useEffect(() => {
        fetchOptions.current = true;
        handleFetch();

        return () => {
            fetchOptions.current = false;
        };
    }, []);

    return (
        <div style={{ width: '300px' }}>
            <Search value={value} inline onChange={handleChange} isLoadingOptions={isLoading}>
                {!isLoading &&
                    Array.isArray(options) &&
                    options.map((result) => <Search.Option value={result.name} key={result.id} />)}
            </Search>
        </div>
    );
}

export default SearchComponent;
