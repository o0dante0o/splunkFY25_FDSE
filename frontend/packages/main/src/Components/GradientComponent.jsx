import React from 'react';

const GradientComponent = () => {
    const gradientStyle = {
        backgroundImage: 'linear-gradient(to right, #ff8008, #ff5c00, #ff3300, #ff0066, #ff00cc)',
        width: '100%',
        height: '100px', // Ajusta la altura según tus necesidades
    };

    return <div style={gradientStyle}>{/* Contenido del componente */}</div>;
};

export default GradientComponent;
