// Routes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Overview from './Views/Overview';
import DataInventory from './Views/DataInventory';
import KnowledgeObjects from './Views/KnowledgeObjects';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/data-inventory" element={<DataInventory />} />
            <Route path="/knowledge-objects" element={<KnowledgeObjects />} />
        </Routes>
    );
};

export default AppRoutes;