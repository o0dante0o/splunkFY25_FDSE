import React from 'react';
import Plot from 'react-plotly.js';

/**
 * PlotComponent
 *
 * A component that renders a pie chart using Plotly.
 *
 * @param {Object} props - The component props.
 * @param {Array<string>} props.labels - The labels for the pie chart.
 * @param {Array<number>} props.values - The values for the pie chart.
 *
 * @returns {JSX.Element} The rendered plot component.
 */
function PlotComponent({ labels, values }) {
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
                            colors: [
                                '#4B0082',
                                '#6A5ACD',
                                '#483D8B',
                                '#4169E1',
                                '#191970',
                                '#2F4F4F',
                            ],
                        },
                        hole: 0.4,
                        hoverinfo: 'label+percent+name',
                        pull: 0.05,
                    },
                ]}
                layout={{
                    title: {
                        text: 'Data Overview',
                        font: {
                            size: 24,
                        },
                    },
                    showlegend: true,
                    legend: {
                        font: {
                            size: 14,
                        },
                        orientation: 'h',
                        x: 0.5,
                        xanchor: 'center',
                        y: -0.1,
                    },
                    margin: { t: 40, b: 40, l: 40, r: 40 },
                    height: 500,
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    scene: {
                        camera: {
                            eye: { x: 1.5, y: 1.5, z: 1.5 },
                        },
                    },
                }}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}

export default PlotComponent;
