import React, { useState, useCallback } from 'react';
import Filter from '@splunk/react-icons/enterprise/Filter';
import Menu from '@splunk/react-ui/Menu';
import Table from '@splunk/react-ui/Table';
import Paginator from '@splunk/react-ui/Paginator';
import Tooltip from '@splunk/react-ui/Tooltip';
import TagsComponent from '@splunk/tags-component';
import CustomClassificationComponent from '@splunk/custom-classification-component';
import ActionsComponent from '@splunk/actions-component';

/**
 * TableComponent
 *
 * A component that renders a table with pagination, filtering, and various custom components.
 *
 * @param {Object[]} data - The data to be displayed in the table.
 * @param {string[]} columns - The columns to be displayed in the table.
 * @param {string[]} kindValues - The kinds of data to filter by.
 *
 * @returns {JSX.Element} The rendered table component.
 */
const TableComponent = ({ data, columns, kindValues }) => {
    // State to manage the filter values
    const [filter, setFilter] = useState([]);

    // State to manage the current page
    const [currentPage, setCurrentPage] = useState(1);

    // Number of rows per page
    const rowsPerPage = 10;

    /**
     * toggleFilterValue
     *
     * Toggles the filter value in the filter state.
     *
     * @param {Object} e - The event object.
     * @param {Object} param1 - The parameter containing the filter value.
     * @param {string} param1.filterValue - The filter value to toggle.
     */
    const toggleFilterValue = useCallback((e, { filterValue }) => {
        setFilter((prevFilter) =>
            prevFilter.includes(filterValue)
                ? prevFilter.filter((f) => f !== filterValue)
                : [...prevFilter, filterValue]
        );
    }, []);

    /**
     * handlePageChange
     *
     * Handles the page change event.
     *
     * @param {Object} event - The event object.
     * @param {Object} param1 - The parameter containing the page number.
     * @param {number} param1.page - The page number to change to.
     */
    const handlePageChange = (event, { page }) => {
        setCurrentPage(page);
    };

    /**
     * truncateText
     *
     * Truncates the text to the specified length.
     *
     * @param {string} text - The text to truncate.
     * @param {number} length - The length to truncate to.
     *
     * @returns {string} The truncated text.
     */
    const truncateText = (text, length = 20) => {
        if (!text) return '';
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };

    /**
     * capitalize
     *
     * Capitalizes the first letter of the string.
     *
     * @param {string} str - The string to capitalize.
     *
     * @returns {string} The capitalized string.
     */
    const capitalize = (str) => {
        if (typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Filter the data based on the filter state
    const filteredData = data.filter((row) => filter.length === 0 || filter.includes(row.kind));

    // Paginate the filtered data
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    /**
     * handleShare
     *
     * Handles sharing the row data by copying it to the clipboard.
     *
     * @param {Object} row - The row data to share.
     */
    const handleShare = (row) => {
        const jsonString = JSON.stringify(row, null, 2);
        navigator.clipboard.writeText(jsonString);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: '1 1 auto', overflow: 'auto' }}>
                <Table stripeRows>
                    <Table.Head>
                        <Table.HeadDropdownCell
                            label={
                                <>
                                    <Filter size={1.5} />
                                    {filter.length > 0
                                        ? ` ${filter.length}/${kindValues.length}`
                                        : ''}
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
                            <Table.Row key={row._id || row.id}>
                                <Table.Cell>{row.kind}</Table.Cell>
                                {columns.map((col) => (
                                    <Table.Cell
                                        key={`${col}-${row._id || row.id}`}
                                        style={{ maxHeight: '10px', overflow: 'hidden' }}
                                    >
                                        {col === 'custom_classification' ? (
                                            <CustomClassificationComponent
                                                id={row._id ? row._id : row.id}
                                                initialClassification={row.custom_classification}
                                                customKey={row.kind}
                                            />
                                        ) : col === 'tags' ? (
                                            <TagsComponent
                                                id={row._id ? row._id : row.id}
                                                tags={row.tags}
                                                customKey={row.kind}
                                            />
                                        ) : (
                                            <Tooltip content={row[col]}>
                                                {truncateText(row[col], 30)}
                                            </Tooltip>
                                        )}
                                    </Table.Cell>
                                ))}
                                <Table.Cell>
                                    <ActionsComponent row={row} customKey={row.kind} />
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
            <Paginator.PageControl
                onChange={handlePageChange}
                current={currentPage}
                totalPages={Math.ceil(filteredData.length / rowsPerPage)}
            />
        </div>
    );
};

export default TableComponent;
