import React, { useEffect, useContext } from 'react';
import { GlobalContext } from './GlobalState';

const FetchData = () => {
    const { setSearchResults, setInitialData } = useContext(GlobalContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/overview'
                );
                const data = await response.json();

                setInitialData(data);
                setSearchResults(data);
            } catch (error) {
                console.error('Error fetching overview data:', error);
            }
        };

        fetchData();
    }, [setInitialData, setSearchResults]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/list?type=all'
                );
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Error fetching list data:', error);
            }
        };

        fetchData();
    }, [setSearchResults]);

    return null;
};

export default FetchData;
