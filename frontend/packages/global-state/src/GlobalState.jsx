// src/GlobalState.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [state, setState] = useState({});
    const [searchResults, setSearchResults] = useState(null); // Añadir searchResults al estado global
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

                setState({
                    list: allItems,
                    overview: itemsCount,
                    currentPath: location.pathname,
                });
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

    const updateClassification = async (id, classification) => {
        try {
            const response = await axios.post(
                `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/add?type=custom_classification&id=${id}`,
                { custom_classification: classification }
            );
            setState((prevState) => ({
                ...prevState,
                list: prevState.list.map((item) =>
                    item._id === id
                        ? { ...item, classification: response.data.classification }
                        : item
                ),
            }));
        } catch (error) {
            console.error('Error updating classification:', error);
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                state,
                searchResults,
                setSearchResults,
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
