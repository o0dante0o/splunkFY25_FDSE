import React, { useContext, useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { GlobalContext } from '../GlobalState';

const Visualizations = () => {
    const { searchResults: searchContextResults } = useContext(GlobalContext);
    const [initialData, setInitialData] = useState({});
    const [searchResults, setSearchResults] = useState({});

    useEffect(() => {
        // Fetch initial data from API
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/overview'
                );
                const data = await response.json();
                setInitialData(data);
                setSearchResults(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (Object.keys(searchContextResults).length > 0) {
            setSearchResults(searchContextResults);
        } else {
            setSearchResults(initialData);
        }
    }, [searchContextResults, initialData]);


    const labels = Object.keys(searchResults);
    const values = Object.values(searchResults).map(value => 
        typeof value === 'object' ? Object.keys(value).length : value.length || value
    );

    return (
        <div style={{ width: '60%', margin: 'auto', padding: '20px' }}>
            <Plot
                data={[
                    {
                        type: 'pie',
                        labels: labels,
                        values: values,
                        textinfo: 'label+percent',
                        textposition: 'inside',
                        automargin: true,
                        marker: {
                            colors: ['#4B0082', '#6A5ACD', '#483D8B', '#4169E1', '#191970', '#2F4F4F']
                        },
                        hole: 0.4, 
                        hoverinfo: 'label+percent+name',
                        pull: 0.05, 
                    }
                ]}
                layout={{
                    title: {
                        text: 'Data Overview',
                        font: {
                            size: 24
                        }
                    },
                    showlegend: true,
                    legend: {
                        font: {
                            size: 14
                        },
                        orientation: 'h', 
                        x: 0.5,
                        xanchor: 'center',
                        y: -0.1
                    },
                    margin: { t: 40, b: 40, l: 40, r: 40 },
                    height: 500,
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    scene: {
                        camera: {
                            eye: {x: 1.5, y: 1.5, z: 1.5}
                        }
                    }
                }}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default Visualizations;
