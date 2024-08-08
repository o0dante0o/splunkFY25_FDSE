import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../GlobalState';
import CardComponent from '../Components/CardComponent';

const Overview = () => {
    const { searchResults: searchContextResults } = useContext(GlobalContext);
    const [initialData, setInitialData] = useState({});
    const [searchResults, setSearchResults] = useState({});

    useEffect(() => {
        // Fetch initial data from API
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/overview'
                );
                const data = await response.json();
                setInitialData(data);
                setSearchResults(data);
                console.log('Initial data:', data);
                console.log('Search results:', searchResults);
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

    const renderValue = (key, value) => {
        if (Array.isArray(value)) {
            return `${value.length} items`;
        } else if (typeof value === 'object') {
            return `${Object.keys(value).length}`;
        } else {
            return value;
        }
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {Object.keys(searchResults).map((key, index) => (
                <CardComponent
                    key={index}
                    keyProp={key}
                    value={renderValue(key, searchResults[key])}
                />
            ))}
        </div>
    );
};

export default Overview;
