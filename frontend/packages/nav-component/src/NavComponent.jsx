import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '@splunk/react-ui/TabBar';
import SearchBar from '@splunk/search-component';
import Dashboard from '@splunk/react-icons/enterprise/Dashboard';
import Table from '@splunk/react-icons/enterprise/Table';

/**
 * NavbarComponent
 *
 * A component that renders a navigation bar with tabs and a search bar.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setResults - Function to set search results.
 *
 * @returns {JSX.Element} The rendered navigation bar component.
 */
const NavbarComponent = ({ setResults }) => {
    const [activeTabId, setActiveTabId] = useState('/');
    const navigate = useNavigate();

    /**
     * handleChange
     *
     * Handles tab change events.
     *
     * @param {Object} e - The event object.
     * @param {Object} selectedTabId - The selected tab ID.
     */
    const handleChange = useCallback(
        (e, { selectedTabId }) => {
            setActiveTabId(selectedTabId);
            navigate(selectedTabId);
        },
        [navigate]
    );

    return (
        <div
            style={{
                margin: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '2em',
                margin: '0px 0px 40px 0px',
                boxShadow:
                    'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
            }}
        >
            <TabBar appearance="context" activeTabId={activeTabId} onChange={handleChange}>
                <TabBar.Tab
                    label="Overview"
                    //icon={<Dashboard screenReaderText={null} />}
                    tabId="/"
                />
                <TabBar.Tab
                    label="Data Inventory"
                    //icon={<Table screenReaderText={null} />}
                    tabId="/data-inventory"
                />
                <TabBar.Tab
                    label="Knowledge Objects"
                    //icon={<Table screenReaderText={null} />}
                    tabId="/knowledge-objects"
                />
                <TabBar.Tab
                    label="Visualizations "
                    //icon={<Table screenReaderText={null} />}
                    tabId="/visualizations "
                />
            </TabBar>
            <SearchBar setResults={setResults} />
        </div>
    );
};

export default NavbarComponent;
