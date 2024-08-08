import React from 'react';
import Button from '@splunk/react-ui/Button';
import Clipboard from '@splunk/react-icons/Clipboard';
import TrashCanCross from '@splunk/react-icons/TrashCanCross';

const ActionsComponent = ({ row, onDelete }) => {
    const handleDelete = async () => {
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
            alert('Deleted successfully ' + row._id);
            onDelete(row._id);
        } else {
            alert(`Failed to delete ${row._id}`);
        }
    };

    const handleShare = () => {
        const jsonString = JSON.stringify(row, null, 2);
        navigator.clipboard.writeText(jsonString);
    };

    return (
        <div>
            <Button
                appearance="primary"
                style={{ backgroundColor: 'red', color: 'white' }}
                icon={<TrashCanCross />}
                onClick={handleDelete}
            />
            <Button icon={<Clipboard />} onClick={handleShare} />
        </div>
    );
};

export default ActionsComponent;
