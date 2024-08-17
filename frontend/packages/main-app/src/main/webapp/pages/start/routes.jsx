// src/routes.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Overview from './Views/overview';
import TablesView from './Views/tablesView';
import Navbar from '@splunk/nav-component';

const AppRoutes = () => {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/data-inventory" element={<TablesView />} />
                <Route path="/knowledge-objects" element={<TablesView />} />
                <Route path="/visualizations" element={<Overview />} />
            </Routes>
        </div>
    );
};

export default AppRoutes;
