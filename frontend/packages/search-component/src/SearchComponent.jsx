import React, { useState } from 'react';
import Typesense from 'typesense';
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

// Configura el cliente de Typesense
const typesense = new Typesense.Client({
    nodes: [
        {
            host: 'YOUR_TYPESENSE_HOST',  // Reemplaza con tu host de Typesense
            port: '8108',                 // Reemplaza con el puerto correcto si es necesario
            protocol: 'http',             // Cambia a 'https' si es necesario
        },
    ],
    apiKey: 'YOUR_API_KEY',               // Reemplaza con tu API key de Typesense
    connectionTimeoutSeconds: 2,
});

const Results = () => {
    const [value, setValue] = useState('');
    const [results, setResults] = useState({});

    const handleChange = (e, { value: searchValue }) => {
        setValue(searchValue);
    };

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            try {
                const searchResults = await typesense.collections('YOUR_COLLECTION_NAME').documents().search({
                    q: value,
                    query_by: 'YOUR_QUERY_FIELDS',  // Reemplaza con los campos por los cuales deseas buscar
                });

                const formattedResults = searchResults.hits.reduce((acc, hit) => {
                    const collectionName = hit.document.collection;
                    if (!acc[collectionName]) {
                        acc[collectionName] = [];
                    }
                    acc[collectionName].push(hit.document);
                    return acc;
                }, {});

                setResults(formattedResults);
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
