import React from 'react';

/**
 * CardComponent
 *
 * A component that displays a card with a key and value, and changes style on hover.
 *
 * @param {string} keyProp - The key to be displayed on the card.
 * @param {any} value - The value to be displayed on the card. Can be a string, array, or object.
 *
 * @returns {JSX.Element} The rendered card component.
 */
const CardComponent = ({ keyProp, value }) => {
    /**
     * handleMouseEnter
     *
     * Handles the mouse enter event to change the card's background and text color.
     *
     * @param {Object} e - The event object.
     */
    const handleMouseEnter = (e) => {
        e.currentTarget.style.backgroundColor = '#A13E92'; // Institutional color
        e.currentTarget.style.color = '#ffffff'; // Change text color for better contrast
    };

    /**
     * handleMouseLeave
     *
     * Handles the mouse leave event to revert the card's background and text color.
     *
     * @param {Object} e - The event object.
     */
    const handleMouseLeave = (e) => {
        e.currentTarget.style.backgroundColor = '#ffffff'; // Original background color
        e.currentTarget.style.color = '#000000'; // Original text color
    };

    /**
     * capitalize
     *
     * Capitalizes the first letter of a string.
     *
     * @param {string} str - The string to be capitalized.
     *
     * @returns {string} The capitalized string.
     */
    const capitalize = (str) => {
        if (typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    /**
     * renderValue
     *
     * Renders the value based on its type (string, array, or object).
     *
     * @param {any} value - The value to be rendered.
     *
     * @returns {JSX.Element|string} The rendered value.
     */
    const renderValue = (value) => {
        if (Array.isArray(value)) {
            return value.join(', ');
        } else if (typeof value === 'object') {
            return (
                <ul style={{ paddingLeft: '20px', textAlign: 'left' }}>
                    {Object.keys(value).map((subKey, index) => (
                        <li key={index}>
                            <strong>{subKey}</strong>: {renderValue(value[subKey])}
                        </li>
                    ))}
                </ul>
            );
        } else {
            return value.toString();
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid #ccc',
                padding: '20px',
                borderRadius: '8px',
                width: '180px',
                height: '180px',
                fontFamily: 'Arial, sans-serif',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease',
                cursor: 'pointer',
                overflowY: 'auto',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>
                {capitalize(keyProp)}
            </div>
            <div style={{ fontSize: '20px' }}>{renderValue(value)}</div>
        </div>
    );
};

export default CardComponent;
