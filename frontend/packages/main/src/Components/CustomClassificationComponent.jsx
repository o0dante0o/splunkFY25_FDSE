import React, { useState } from 'react';
import Button from '@splunk/react-ui/Button';
import Dropdown from '@splunk/react-ui/Dropdown';
import Menu from '@splunk/react-ui/Menu';
import axios from 'axios';

const CustomClassificationComponent = ({ id, initialClassification, onUpdate }) => {
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
                onUpdate(id, classification); // Ensure handleUpdate is called here
            })
            .catch((error) => {
                console.error('Error updating classification:', error);
            });
    };

    const getColorForClassification = (classification) => {
        switch (classification) {
            case 'TopSecret/SCI':
                return { color: 'darkred', backgroundColor: '#ffcccc' };
            case 'TopSecret':
                return { color: 'darkred', backgroundColor: '#ff9999' };
            case 'Secret':
                return { color: 'orange', backgroundColor: '#ffe6cc' };
            case 'Confidential':
                return { color: 'blue', backgroundColor: '#cce6ff' };
            case 'Unclassified':
                return { color: 'green', backgroundColor: '#ccffcc' };
            default:
                return { color: 'black', backgroundColor: 'white' };
        }
    };

    const toggle = (
        <Button 
            appearance="toggle" 
            label={classification || 'Select Classification'} 
            isMenu 
            style={getColorForClassification(classification)}
        />
    );

    return (
        <Dropdown toggle={toggle}>
            <Menu style={{ width: 200 }}>
                <Menu.Item
                    label="TopSecret/SCI"
                    value="TopSecret/SCI"
                    onClick={() => handleSelect('TopSecret/SCI')}
                    style={getColorForClassification('TopSecret/SCI')}
                >
                    TopSecret/SCI
                </Menu.Item>
                <Menu.Item
                    label="TopSecret"
                    value="TopSecret"
                    onClick={() => handleSelect('TopSecret')}
                    style={getColorForClassification('TopSecret')}
                >
                    TopSecret
                </Menu.Item>
                <Menu.Item
                    label="Secret"
                    value="Secret"
                    onClick={() => handleSelect('Secret')}
                    style={getColorForClassification('Secret')}
                >
                    Secret
                </Menu.Item>
                <Menu.Item
                    label="Confidential"
                    value="Confidential"
                    onClick={() => handleSelect('Confidential')}
                    style={getColorForClassification('Confidential')}
                >
                    Confidential
                </Menu.Item>
                <Menu.Item
                    label="Unclassified"
                    value="Unclassified"
                    onClick={() => handleSelect('Unclassified')}
                    style={getColorForClassification('Unclassified')}
                >
                    Unclassified
                </Menu.Item>
            </Menu>
        </Dropdown>
    );
};

export default CustomClassificationComponent;
