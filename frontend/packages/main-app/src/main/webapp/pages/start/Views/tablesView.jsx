import React, { useContext } from 'react';
import { GlobalContext } from '@splunk/global-state';
import TableComponent from '@splunk/table-component';

const filterListBySearchResults = (list, searchResults) => {
    const filteredList = {};

    Object.keys(list).forEach((key) => {
        if (searchResults[key]) {
            console.log('searchResults[key]', searchResults[key]);
            filteredList[key] = list[key].filter((item) => {
                const match = searchResults[key].some((result) => result._id === item._id);
                console.log(
                    `Filtering ${key}:`,
                    { 'item------------------------------------------': item },
                    { 'match------------------------------------------': match }
                );
                return match; // Solo agregar si hay un match positivo
            });
        } else {
            filteredList[key] = []; // No agregar elementos si no hay resultados de búsqueda
        }
    });
    console.log('filteredList', filteredList);
    return filteredList;
};

const TablesView = () => {
    const { state } = useContext(GlobalContext);
    const { list, currentPath, searchResults } = state;
    console.log('search results from tablesView', searchResults);
    if (!currentPath) {
        return <p>Cargando datos...</p>; // Mensaje de carga
    }

    const dataToRender =
        searchResults && Object.keys(searchResults).length > 0
            ? filterListBySearchResults(list, searchResults)
            : list;
    console.log('dataToRender', dataToRender);

    const collectionsForDataInventory = ['lookups', 'fields', 'index', 'sources'];
    const collectionsForOtherPaths = ['dashboards', 'apps', 'reports', 'alerts'];

    const columns = ['name', 'description', 'owner', 'custom_classification', 'tags'];

    const getFilteredData = (data, collections) => {
        return collections.reduce((acc, key) => {
            if (data[key]) {
                acc[key] = data[key].map((item) => ({ ...item, kind: key }));
            }
            return acc;
        }, {});
    };

    let filteredData = {};
    if (currentPath === '/data-inventory') {
        filteredData = getFilteredData(dataToRender, collectionsForDataInventory);
    } else if (currentPath === '/knowledge-objects') {
        filteredData = getFilteredData(dataToRender, collectionsForOtherPaths);
    }

    const transformedData = Object.keys(filteredData).flatMap((kind) =>
        filteredData[kind].map((item) => ({
            ...item,
            kind,
        }))
    );

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '20px',
            }}
        >
            <TableComponent
                data={transformedData}
                columns={columns}
                kindValues={Object.keys(filteredData)}
            />
        </div>
    );
};

export default TablesView;
