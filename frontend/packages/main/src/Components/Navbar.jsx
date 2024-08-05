import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '@splunk/react-ui/TabBar';
import SearchBar from './SearchBar';

const Navbar = ({ setResults }) => {
    const [activeTabId, setActiveTabId] = useState('/');
    const navigate = useNavigate();

    const handleChange = useCallback((e, { selectedTabId }) => {
        setActiveTabId(selectedTabId);
        navigate(selectedTabId);
    }, [navigate]);

    return (
        <div>
            <TabBar appearance="context" activeTabId={activeTabId} onChange={handleChange}>
                <TabBar.Tab label="Overview" tabId="/" />
                <TabBar.Tab label="Data Inventory" tabId="/data-inventory" />
                <TabBar.Tab label="Knowledge Objects" tabId="/knowledge-objects" />
            </TabBar>
            <SearchBar setResults={setResults} />
        </div>
    );
};

export default Navbar;