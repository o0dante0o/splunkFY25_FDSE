import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [state, setState] = useState({
        list: {},
        overview: {},
        currentPath: '',
        searchResults: {},
    });

    const location = useLocation();

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
                    searchResults: prevState.searchResults,
                }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchInitialData();
    }, [location.pathname]);

    const removeItem = async (id, type, customKey) => {
        try {
            await axios.post(
                `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/remove?type=${type}&id=${id}`,
                { id }
            );
            setState((prevState) => {
                const updatedList = prevState.list[customKey].filter((item) => item._id !== id);
                let updatedSearchResults = prevState.searchResults;

                if (updatedSearchResults && Array.isArray(updatedSearchResults[customKey])) {
                    updatedSearchResults = {
                        ...updatedSearchResults,
                        [customKey]: updatedSearchResults[customKey].filter(
                            (item) => item._id !== id
                        ),
                    };
                }

                return {
                    ...prevState,
                    list: {
                        ...prevState.list,
                        [customKey]: updatedList,
                    },
                    searchResults: updatedSearchResults,
                };
            });
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const addTag = async (id, tag, customKey) => {
        try {
            const response = await axios.post(
                `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/add?type=add_tag&id=${id}`,
                { tag }
            );
            setState((prevState) => {
                const updatedList = prevState.list[customKey].map((item) =>
                    item._id === id ? { ...item, tags: [...item.tags, tag] } : item
                );
                let updatedSearchResults = prevState.searchResults;

                if (updatedSearchResults && Array.isArray(updatedSearchResults[customKey])) {
                    updatedSearchResults = {
                        ...updatedSearchResults,
                        [customKey]: updatedSearchResults[customKey].map((item) =>
                            item._id === id ? { ...item, tags: [...item.tags, tag] } : item
                        ),
                    };
                }

                return {
                    ...prevState,
                    list: {
                        ...prevState.list,
                        [customKey]: updatedList,
                    },
                    searchResults: updatedSearchResults,
                };
            });
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    };

    const removeTag = async (id, tag, customKey) => {
        try {
            await axios.post(
                `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/remove?type=remove_tag&id=${id}`,
                { tag }
            );
            setState((prevState) => {
                const updatedList = prevState.list[customKey].map((item) =>
                    item._id === id ? { ...item, tags: item.tags.filter((t) => t !== tag) } : item
                );
                let updatedSearchResults = prevState.searchResults;

                if (updatedSearchResults && Array.isArray(updatedSearchResults[customKey])) {
                    updatedSearchResults = {
                        ...updatedSearchResults,
                        [customKey]: updatedSearchResults[customKey].map((item) =>
                            item._id === id
                                ? { ...item, tags: item.tags.filter((t) => t !== tag) }
                                : item
                        ),
                    };
                }

                return {
                    ...prevState,
                    list: {
                        ...prevState.list,
                        [customKey]: updatedList,
                    },
                    searchResults: updatedSearchResults,
                };
            });
        } catch (error) {
            console.error('Error removing tag:', error);
        }
    };

    const updateClassification = async (id, classification, key) => {
        console.log('id', id);
        try {
            const response = await axios.post(
                `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/add?type=custom_classification&id=${id}`,
                { custom_classification: classification }
            );
            console.log('response', response);
            setState((prevState) => {
                const listToUpdate = prevState.list[key];
                let updatedSearchResults = prevState.searchResults;

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
                    return prevState;
                }

                return {
                    ...prevState,
                    list: {
                        ...prevState.list,
                        [key]: listToUpdate.map((item) =>
                            item._id === id ? { ...item, classification: classification } : item
                        ),
                    },
                    searchResults: updatedSearchResults,
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
