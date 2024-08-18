import React, { useState, useContext } from 'react';
import Button from '@splunk/react-ui/Button';
import Dropdown from '@splunk/react-ui/Dropdown';
import Menu from '@splunk/react-ui/Menu';
import { GlobalContext } from '@splunk/global-state';

/**
 * CustomClassificationComponent
 *
 * A component that allows users to select a classification from a dropdown menu.
 *
 * @param {string} id - The unique identifier for the classification item.
 * @param {string} initialClassification - The initial classification value.
 * @param {string} customKey - A custom key used for updating the classification.
 *
 * @returns {JSX.Element} The rendered component.
 */
const CustomClassificationComponent = ({ id, initialClassification, customKey }) => {
    const { updateClassification } = useContext(GlobalContext);
    const [classification, setClassification] = useState(initialClassification);

    /**
     * handleSelect
     *
     * Handles the selection of a classification from the dropdown menu.
     *
     * @param {string} value - The selected classification value.
     */
    const handleSelect = (value) => {
        setClassification(value);
        updateClassification(id, value, customKey); // Use customKey instead of key
    };

    /**
     * getColorForClassification
     *
     * Returns the color and background color for a given classification.
     *
     * @param {string} classification - The classification value.
     *
     * @returns {Object} An object containing the color and background color.
     */
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
