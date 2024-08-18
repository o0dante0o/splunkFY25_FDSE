import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [state, setState] = useState({
        list: {},
        overview: {},
        currentPath: '',
        searchResults: {}, // Inicializar searchResults
    });
    console.log('searchResults', state.searchResults);
    const location = useLocation();
    console.log('location', location);
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const all_items = await fetch(
                    'https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/list?type=all'
                );
                const allItems = await all_items.json();

                const items_count = await fetch(
                    'https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/overview'
                );
                const itemsCount = await items_count.json();

                setState((prevState) => ({
                    list: allItems,
                    overview: itemsCount,
                    currentPath: location.pathname,
                    searchResults: prevState.searchResults, // Mantener searchResults
                }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchInitialData();
    }, [location.pathname]);

    const addItem = async (id, type) => {
        try {
            const response = await axios.post(
                `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/add?type=${type}&id=${id}`
            );
            setState((prevState) => ({
                ...prevState,
                list: [...prevState.list, response.data],
            }));
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const removeItem = async (id, type) => {
        try {
            await axios.post(
                `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/remove?type=${type}&id=${id}`,
                { id }
            );
            setState((prevState) => ({
                ...prevState,
                list: prevState.list.filter((item) => item._id !== id),
            }));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const addTag = async (id, tag) => {
        try {
            const response = await axios.post(
                `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/add?type=add_tag&id=${id}`,
                { tag }
            );
            setState((prevState) => ({
                ...prevState,
                list: prevState.list.map((item) =>
                    item._id === id ? { ...item, tags: [...item.tags, tag] } : item
                ),
            }));
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    };

    const removeTag = async (id, tag) => {
        try {
            await axios.post(
                `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/remove?type=remove_tag&id=${id}`,
                { tag }
            );
            setState((prevState) => ({
                ...prevState,
                list: prevState.list.map((item) =>
                    item._id === id ? { ...item, tags: item.tags.filter((t) => t !== tag) } : item
                ),
            }));
        } catch (error) {
            console.error('Error removing tag:', error);
        }
    };

    const updateClassification = async (id, classification, key) => {
        console.log('id', id + 'classification', classification + 'key', key);
        try {
            const response = await axios.post(
                `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/add?type=custom_classification&id=${id}`,
                { custom_classification: classification }
            );

            setState((prevState) => {
                const listToUpdate = prevState.list[key]; // Access the specific array
                // Check and update searchResults if necessary
                let updatedSearchResults = prevState.searchResults;
                console.log('prevState', prevState);
                console.log('updatedSearchResults', updatedSearchResults);
                if (updatedSearchResults && Array.isArray(updatedSearchResults[key])) {
                    updatedSearchResults = {
                        ...updatedSearchResults,
                        [key]: updatedSearchResults[key].map((item) =>
                            item.id === id
                                ? { ...item, custom_classification: classification }
                                : item
                        ),
                    };
                }
                if (!Array.isArray(listToUpdate)) {
                    console.error(`The list under the key "${key}" is not an array`);
                    return prevState; // If it's not an array, return the previous state unchanged
                }

                return {
                    ...prevState,
                    list: {
                        ...prevState.list,
                        [key]: listToUpdate.map((item) =>
                            item._id === id ? { ...item, classification: classification } : item
                        ),
                    },
                    searchResults: updatedSearchResults, // Asegúrate de actualizar searchResults
                };
            });
        } catch (error) {
            console.error('Error updating classification:', error);
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                state,
                searchResults: state.searchResults,
                setSearchResults: (newResults) =>
                    setState((prevState) => ({ ...prevState, searchResults: newResults })),
                addItem,
                removeItem,
                addTag,
                removeTag,
                updateClassification,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
