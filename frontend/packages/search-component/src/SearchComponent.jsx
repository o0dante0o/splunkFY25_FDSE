import React, { useEffect, useRef, useState, useContext } from 'react';
import Search from '@splunk/react-ui/Search';
import { GlobalContext } from '@splunk/global-state';
import Typesense from 'typesense';

/**
 * SearchComponent
 *
 * A component that provides a search interface using Typesense and displays the results.
 *
 * @returns {JSX.Element} The rendered search component.
 */
function SearchComponent() {
    // Get the setSearchResults function from the global context
    const { setSearchResults } = useContext(GlobalContext);

    // State to manage loading status
    const [isLoading, setIsLoading] = useState(false);

    // State to manage search options
    const [options, setOptions] = useState([]);

    // State to manage the search value
    const [value, setValue] = useState('');

    // Reference to control whether to update options
    const fetchOptions = useRef(null);

    // Typesense client configuration
    const typesense = new Typesense.Client({
        nodes: [
            {
                host: 'fevqlxr7zw9gh45bp-1.a1.typesense.net',
                port: '443',
                protocol: 'https',
            },
        ],
        apiKey: 'jpmBZkUymyxRxKOzxiwVS7b2JG8Ou2iS',
        connectionTimeoutSeconds: 2,
    });

    /**
     * handleFetch
     *
     * Fetches search results from Typesense based on the search value.
     *
     * @param {string} searchValue - The value to search for.
     */
    const handleFetch = async (searchValue = '') => {
        setValue(searchValue);
        if (searchValue.length > 2) {
            setIsLoading(true);
            try {
                const searchParameters = {
                    q: searchValue,
                    query_by: 'name,description,owner,custom_classification,tags',
                    per_page: 100,
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
                    setOptions(filteredResults);
                    setSearchResults(filteredResults);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
                setIsLoading(false);
                setSearchResults([]);
            }
        } else {
            setOptions([]);
            setSearchResults([]);
        }
    };

    /**
     * handleChange
     *
     * Handles the change event for the search input.
     *
     * @param {Object} e - The event object.
     * @param {Object} param1 - The parameter containing the search value.
     * @param {string} param1.value - The search value.
     */
    const handleChange = (e, { value: searchValue }) => {
        handleFetch(searchValue);
    };

    // Effect to initialize the search and clean up the reference on component unmount
    useEffect(() => {
        fetchOptions.current = true;
        handleFetch();

        return () => {
            fetchOptions.current = false;
        };
    }, []);

    // Render the search component
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
