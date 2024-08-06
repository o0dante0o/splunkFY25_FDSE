import React, { useState } from 'react';
import Button from '@splunk/react-ui/Button';
import Dropdown from '@splunk/react-ui/Dropdown';
import Menu from '@splunk/react-ui/Menu';
import axios from 'axios';

const CustomClassificationComponent = ({ id, initialClassification }) => {
    const [classification, setClassification] = useState(initialClassification);

    const handleSelect = (value) => {
        setClassification(value);
        updateClassification(id, value);
    };

    const updateClassification = (id, classification) => {
        axios
            .post(
                `https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/add?type=custom_classification&id=${id}`,
                { custom_classification: classification }
            )
            .then((response) => {
                console.log('Classification updated:', response.data);
            })
            .catch((error) => {
                console.error('Error updating classification:', error);
            });
    };

    const toggle = (
        <Button appearance="toggle" label={classification || 'Select Classification'} isMenu />
    );

    return (
        <Dropdown toggle={toggle}>
            <Menu style={{ width: 200 }}>
                <Menu.Item
                    label="TopSecret/SCI"
                    value="TopSecret/SCI"
                    onClick={() => handleSelect('TopSecret/SCI')}
                >
                    TopSecret/SCI
                </Menu.Item>
                <Menu.Item
                    label="TopSecret"
                    value="TopSecret"
                    onClick={() => handleSelect('TopSecret')}
                >
                    TopSecret
                </Menu.Item>
                <Menu.Item label="Secret" value="Secret" onClick={() => handleSelect('Secret')}>
                    Secret
                </Menu.Item>
                <Menu.Item
                    label="Confidential"
                    value="Confidential"
                    onClick={() => handleSelect('Confidential')}
                >
                    Confidential
                </Menu.Item>
                <Menu.Item
                    label="Unclassified"
                    value="Unclassified"
                    onClick={() => handleSelect('Unclassified')}
                >
                    Unclassified
                </Menu.Item>
            </Menu>
        </Dropdown>
    );
};

export default CustomClassificationComponent;
