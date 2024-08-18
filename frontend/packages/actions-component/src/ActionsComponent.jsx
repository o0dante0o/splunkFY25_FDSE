import React, { useContext } from 'react';
import Button from '@splunk/react-ui/Button';
import TrashCanCross from '@splunk/react-icons/TrashCanCross';
import Clipboard from '@splunk/react-icons/Clipboard';
import { GlobalContext } from '@splunk/global-state';

/**
 * ActionsComponent
 *
 * A component that provides action buttons for deleting and sharing a row item.
 *
 * @param {Object} row - The row data object.
 * @param {string} customKey - A custom key used for identifying the item to be removed.
 *
 * @returns {JSX.Element} The rendered component.
 */
const ActionsComponent = ({ row, customKey }) => {
    const { removeItem } = useContext(GlobalContext);

    /**
     * handleDelete
     *
     * Handles the deletion of the row item.
     *
     * @returns {Promise<void>} A promise that resolves when the item is removed.
     */
    const handleDelete = async () => {
        await removeItem(row._id, 'remove_document', customKey);
    };

    /**
     * handleShare
     *
     * Handles sharing the row data by copying it to the clipboard.
     */
    const handleShare = () => {
        const jsonString = JSON.stringify(row, null, 2);
        navigator.clipboard.writeText(jsonString);
    };

    return (
        <>
            <Button
                appearance="primary"
                style={{ backgroundColor: 'red', color: 'white' }}
                icon={<TrashCanCross />}
                onClick={handleDelete}
            />
            <Button icon={<Clipboard />} onClick={handleShare} />
        </>
    );
};

export default ActionsComponent;
