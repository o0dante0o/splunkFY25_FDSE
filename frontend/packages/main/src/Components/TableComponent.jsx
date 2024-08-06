import React, { useState, useCallback } from 'react';
import Filter from '@splunk/react-icons/enterprise/Filter';
import Menu from '@splunk/react-ui/Menu';
import Table from '@splunk/react-ui/Table';
import Paginator from '@splunk/react-ui/Paginator';
import TagsComponent from './TagsComponent'; // Asegúrate de importar el nuevo componente
import CustomClassificationComponent from './CustomClassificationComponent'; // Importar el nuevo componente

const TableComponent = ({ data, columns, kindValues }) => {
    const [filter, setFilter] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const toggleFilterValue = useCallback((e, { filterValue }) => {
        setFilter((prevFilter) =>
            prevFilter.includes(filterValue)
                ? prevFilter.filter((f) => f !== filterValue)
                : [...prevFilter, filterValue]
        );
    }, []);

    const handlePageChange = (event, { page }) => {
        setCurrentPage(page);
    };

    const filteredData = data.filter((row) => filter.length === 0 || filter.includes(row.kind));
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <>
            <Table stripeRows>
                <Table.Head>
                    <Table.HeadDropdownCell
                        label={
                            <>
                                <Filter size={1.5} />
                                Kind
                                {filter.length > 0 ? ` ${filter.length}/${kindValues.length}` : ''}
                            </>
                        }
                    >
                        <Menu>
                            {kindValues.map((kind) => (
                                <Menu.Item
                                    key={kind}
                                    selectable
                                    selected={filter.includes(kind)}
                                    onClick={(e) =>
                                        toggleFilterValue(e, {
                                            filterValue: kind,
                                        })
                                    }
                                >
                                    {kind}
                                </Menu.Item>
                            ))}
                        </Menu>
                    </Table.HeadDropdownCell>
                    {columns.map((col) => (
                        <Table.HeadCell key={col}>{col}</Table.HeadCell>
                    ))}
                </Table.Head>
                <Table.Body>
                    {paginatedData.map((row) => (
                        <Table.Row key={row._id} style={{ maxWidth: '200px' }}>
                            <Table.Cell>{row.kind}</Table.Cell>
                            {columns.map((col) => (
                                <Table.Cell
                                    key={col}
                                    style={{ maxHeight: '50px', overflow: 'hidden' }}
                                >
                                    {col === 'custom_classification' ? (
                                        <CustomClassificationComponent
                                            id={row._id}
                                            initialClassification={row.custom_classification}
                                        />
                                    ) : (
                                        row[col]
                                    )}
                                </Table.Cell>
                            ))}
                            <Table.Cell>
                                <TagsComponent id={row._id} tags={row.tags} />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <Paginator.PageControl
                onChange={handlePageChange}
                current={currentPage}
                totalPages={Math.ceil(filteredData.length / rowsPerPage)}
            />
        </>
    );
};

export default TableComponent;
