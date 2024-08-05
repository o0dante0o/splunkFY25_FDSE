import React, { useState } from 'react';
import axios from 'axios';
import Search from '@splunk/react-ui/Search';
import Card from '@splunk/react-ui/Card';

const cardForResult = (collectionName, count) => {
    return (
        <Card key={collectionName} style={{ margin: '0 20px 20px 0' }}>
            <Card.Header title={`${collectionName}`} />
            <Card.Body>
                {`${count}`}
            </Card.Body>
        </Card>
    );
};

const Results = () => {
    const [value, setValue] = useState('');
    const [results, setResults] = useState({});

    const handleChange = (e, { value: searchValue }) => {
        setValue(searchValue);
    };

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            try {
                const response = await axios.get(`https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/search?q=${value}`);
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    return (
        <>
            <Search
                aria-controls="example-search-results"
                onChange={handleChange}
                value={value}
                onKeyPress={handleKeyPress}
            />
            <div id="example-search-results" style={{ paddingTop: '10px' }}>
                {Object.keys(results).map((collectionName) =>
                    cardForResult(collectionName, results[collectionName].length)
                )}
            </div>
        </>
    );
};

export default Results;
