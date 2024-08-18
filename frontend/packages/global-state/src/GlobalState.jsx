import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const GlobalContext = createContext();

/**
 * GlobalProvider
 *
 * A context provider that manages global state and provides functions to manipulate it.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will have access to the context.
 *
 * @returns {JSX.Element} The context provider component.
 */
export const GlobalProvider = ({ children }) => {
    const [state, setState] = useState({
        list: {},
        overview: {},
        currentPath: '',
        searchResults: {},
    });

    const location = useLocation();

    useEffect(() => {
        /**
         * fetchInitialData
         *
         * Fetches initial data for the list and overview from the API.
         */
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

    /**
     * removeItem
     *
     * Removes an item from the list and updates the state.
     *
     * @param {string} id - The ID of the item to be removed.
     * @param {string} type - The type of removal operation.
     * @param {string} customKey - The key under which the item is stored.
     */
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

    /**
     * addTag
     *
     * Adds a tag to an item and updates the state.
     *
     * @param {string} id - The ID of the item to be tagged.
     * @param {string} tag - The tag to be added.
     * @param {string} customKey - The key under which the item is stored.
     */
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

    /**
     * removeTag
     *
     * Removes a tag from an item and updates the state.
     *
     * @param {string} id - The ID of the item to be untagged.
     * @param {string} tag - The tag to be removed.
     * @param {string} customKey - The key under which the item is stored.
     */
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

    /**
     * updateClassification
     *
     * Updates the classification of an item and updates the state.
     *
     * @param {string} id - The ID of the item to be updated.
     * @param {string} classification - The new classification value.
     * @param {string} key - The key under which the item is stored.
     */
    const updateClassification = async (id, classification, key) => {
        try {
            const response = await axios.post(
                `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/add?type=custom_classification&id=${id}`,
                { custom_classification: classification }
            );
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
