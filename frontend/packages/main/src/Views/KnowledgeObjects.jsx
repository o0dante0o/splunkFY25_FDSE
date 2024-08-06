import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../GlobalState';

const Overview = () => {
    const { searchResults: searchContextResults } = useContext(GlobalContext);
    const [initialData, setInitialData] = useState({});
    const [searchResults, setSearchResults] = useState({});

    useEffect(() => {
        // Fetch initial data from API
        const fetchData = async () => {
            try {
                const response = await fetch('https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/overview');
                const data = await response.json();
                console.lot(data);
                setInitialData(data);
                setSearchResults(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Update searchResults based on searchContextResults
        if (Object.keys(searchContextResults).length > 0) {
            setSearchResults(searchContextResults);
        } else {
            setSearchResults(initialData);
        }
    }, [searchContextResults, initialData]);

    const renderValue = (key, value) => {
        if (Array.isArray(value)) {
            return (
                <div>
                    <strong>{key}</strong>: {value.length}
                </div>
            );
        } else if (typeof value === 'object') {
            return (
                <div>
                    <strong>{key}</strong>: {Object.keys(value).length}
                </div>
            );
        } else {
            return (
                <div>
                    <strong>{key}</strong>: {value}
                </div>
            );
        }
    };

    return (
        <div>
            <ul>
                {Object.keys(searchResults).map((key, index) => (
                    <li key={index}>
                        {renderValue(key, searchResults[key])}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Overview;