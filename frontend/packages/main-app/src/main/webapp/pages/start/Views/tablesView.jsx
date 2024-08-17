import React, { useContext } from 'react';
import { GlobalContext } from '@splunk/global-state'; // Asegúrate de que la ruta sea correcta

const TablesView = () => {
    const { state } = useContext(GlobalContext);
    const { currentPath } = state;

    return (
        <div>
            <h1> {currentPath === '/data-inventory' ? 'Data Inventory' : 'Knowledge Objects'}</h1>
        </div>
    );
};

export default TablesView;
