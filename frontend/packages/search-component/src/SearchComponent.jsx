import React, { useState } from 'react';
import axios from 'axios';

const SearchComponent = () => {
    const [searchResults, setSearchResults] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await axios.get('https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/overview');
            const data = response.data;

            if (data && typeof data === 'object') {
                setSearchResults(data);
            } else {
                console.error('Expected an object but got:', data);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <div>
            <button onClick={handleSearch}>Search</button>
            {searchResults && (
                <ul>
                    {Object.entries(searchResults).map(([key, value]) => (
                        <li key={key}>{`${key}: ${value}`}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchComponent;
