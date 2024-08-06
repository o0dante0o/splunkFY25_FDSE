// Routes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Overview from './Views/Overview';
import DataTables from './Views/DataTables';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/data-inventory" element={<DataTables />} />
            <Route path="/knowledge-objects" element={<DataTables />} />
        </Routes>
    );
};

export default AppRoutes;
