// src/Views/Overview.jsx
import React, { useContext } from 'react';
import { GlobalContext } from '../GlobalState';

const Overview = () => {
    const { searchResults } = useContext(GlobalContext);

    return (
        <div>
            <h2>Overview</h2>
            <ul>
                {Object.keys(searchResults).map((collection, index) => (
                    <li key={index}>
                        <strong>{collection}</strong>
                        <ul>
                            {searchResults[collection].map((result, idx) => (
                                <li key={idx}>{JSON.stringify(result)}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Overview;