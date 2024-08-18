import React, { useContext } from 'react';
import Button from '@splunk/react-ui/Button';
import TrashCanCross from '@splunk/react-icons/TrashCanCross';
import Clipboard from '@splunk/react-icons/Clipboard';
import { GlobalContext } from '@splunk/global-state';

const ActionsComponent = ({ row }) => {
    const { removeItem } = useContext(GlobalContext);

    const handleDelete = async () => {
        await removeItem(row._id, 'remove_document');
    };

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
