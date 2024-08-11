import React, { useState, useCallback } from 'react';
import Filter from '@splunk/react-icons/enterprise/Filter';
import Menu from '@splunk/react-ui/Menu';
import Table from '@splunk/react-ui/Table';
import Paginator from '@splunk/react-ui/Paginator';
import Tooltip from '@splunk/react-ui/Tooltip';
import TagsComponent from './TagsComponent';
import CustomClassificationComponent from './CustomClassificationComponent';
import Button from '@splunk/react-ui/Button';
import TrashCanCross from '@splunk/react-icons/TrashCanCross';
import Clipboard from '@splunk/react-icons/Clipboard';

const TableComponent = ({ data, columns, kindValues, onDelete, onUpdate, onUpdateTags }) => {
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

    const truncateText = (text, length = 20) => {
        if (!text) return '';
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };

    const capitalize = (str) => {
        if (typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const filteredData = data.filter((row) => filter.length === 0 || filter.includes(row.kind));
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleDelete = async (row) => {
        const response = await fetch(
            `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/remove?type=remove_document&id=${row._id}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: row._id }),
            }
        );
        if (response.ok) {
            onDelete(row._id); 
        } else {
            alert(`Failed to delete ${row._id}`);
        }
    };

    const handleShare = (row) => {
        const jsonString = JSON.stringify(row, null, 2);
        navigator.clipboard.writeText(jsonString);
    };

    return (
        <>
            <Table stripeRows>
                <Table.Head>
                    <Table.HeadDropdownCell
                        label={
                            <>
                                <Filter size={1.5} />
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
                        <Table.HeadCell key={col}>{capitalize(col)}</Table.HeadCell>
                    ))}

                    <Table.HeadCell>Options</Table.HeadCell>

                </Table.Head>
                <Table.Body>
                    {paginatedData.map((row) => (
                        <Table.Row key={row._id} style={{ maxWidth: '100px' }}>
                            <Table.Cell>{row.kind}</Table.Cell>
                            {columns.map((col) => (
                                <Table.Cell
                                    key={col}
                                    style={{ maxHeight: '10px', overflow: 'hidden' }}
                                >
                                    {col === 'custom_classification' ? (
                                        <CustomClassificationComponent
                                            id={row._id}
                                            initialClassification={row.custom_classification}
                                            onUpdate={onUpdate}
                                        />
                                    ) : col === 'tags' ? (
                                        <TagsComponent 
                                            id={row._id} 
                                            tags={row.tags}
                                            onUpdateTags={onUpdateTags}
                                        />
                                    ) : (
                                        <Tooltip content={row[col]}>
                                            {truncateText(row[col], 30)}
                                        </Tooltip>
                                    )}
                                </Table.Cell>
                            ))}
                            <Table.Cell>
                                <Button
                                    appearance="primary"
                                    style={{ backgroundColor: 'red', color: 'white' }}
                                    icon={<TrashCanCross />}
                                    onClick={() => handleDelete(row)}
                                />
                                <Button icon={<Clipboard />} onClick={() => handleShare(row)} />
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