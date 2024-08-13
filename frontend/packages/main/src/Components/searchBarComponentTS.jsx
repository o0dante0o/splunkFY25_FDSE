import React, { useEffect, useRef, useState, useContext } from 'react';
import Search from '@splunk/react-ui/Search';
import { GlobalContext } from '../GlobalState';
import Typesense from 'typesense';

function Loading() {
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
            setIsLoading(true);
            try {
                const searchParameters = {
                    q: searchValue,
                    query_by: 'name,description,owner',
                };
    
                // Predefinir las colecciones en las que buscar
                const collections = ['sources', 'reports', 'lookups', 'index', 'fields', 'dashboards', 'apps', 'alerts'];
    
                // Inicializar un objeto para almacenar los resultados por colección
                let allResults = {
                    sources: [],
                    reports: [],
                    lookups: [],
                    index: [],
                    fields: [],
                    dashboards: [],
                    apps: [],
                    alerts: []
                };
    
                // Realizar la búsqueda en cada colección predefinida
                for (const collectionName of collections) {
                    try {
                        const searchResults = await typesense
                            .collections(collectionName)
                            .documents()
                            .search(searchParameters);
    
                        const results = searchResults.hits.map((hit) => hit.document);
                        allResults[collectionName] = results; // Almacenar los resultados en su respectiva colección
                    } catch (searchError) {
                        console.error(`Error searching in collection ${collectionName}:`, searchError);
                    }
                }
    
                // Filtrar las colecciones que tienen resultados (listas no vacías)
                const filteredResults = Object.keys(allResults)
                    .filter(key => allResults[key].length > 0)
                    .reduce((obj, key) => {
                        obj[key] = allResults[key];
                        return obj;
                    }, {});
    
                if (fetchOptions.current) {
                    // Check if the component is still mounted
                    console.log('Filtered Search Results:', filteredResults);
                    setOptions(filteredResults);
                    setSearchResults(filteredResults); // Almacenar los resultados filtrados
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
                setIsLoading(false);
            }
        } else {
            setOptions([]);
            setSearchResults([]);
        }
    };
    

    const generateOptions = () => {
        if (isLoading) {
            return null;
        }

        return Array.isArray(options)
            ? options.map((result) => <Search.Option value={result.name} key={result.id} />)
            : [];
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

    const searchOptions = generateOptions();

    return (
        <div style={{ width: '300px' }}>
            <Search value={value} inline onChange={handleChange} isLoadingOptions={isLoading}>
                {searchOptions}
            </Search>
        </div>
    );
}

export default Loading;
