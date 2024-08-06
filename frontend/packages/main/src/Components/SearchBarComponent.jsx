import React, { useEffect, useRef, useState, useContext } from 'react';
import Search from '@splunk/react-ui/Search';
import { GlobalContext } from '../GlobalState'; // Asegúrate de importar tu contexto global

function Loading() {
    const { setSearchResults } = useContext(GlobalContext);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState('');
    const fetchOptions = useRef(null);

    const handleFetch = async (searchValue = '') => {
        setValue(searchValue);
        if (searchValue.length > 2) {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/search?q=${searchValue}`
                );
                if (response.ok) {
                    const searchResults = await response.json();
                    if (fetchOptions.current) {
                        // Check if the component is still mounted
                        setOptions(searchResults);
                        setSearchResults(searchResults);
                        setIsLoading(false);
                    }
                } else {
                    console.error('Error fetching search results:', response.statusText);
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
            ? options.map((result) => <Search.Option value={result.title} key={result.id} />)
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
            {' '}
            {/* Ajusta el tamaño aquí */}
            <Search value={value} inline onChange={handleChange} isLoadingOptions={isLoading}>
                {searchOptions}
            </Search>
        </div>
    );
}

export default Loading;
