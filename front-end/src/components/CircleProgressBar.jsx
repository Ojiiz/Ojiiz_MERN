import React from 'react';
import { Chart } from 'chart.js';

class CircleProgressBar extends React.Component {
    componentDidMount() {
        const ctx = document.getElementById('circle-progress').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [this.props.progress],
                    backgroundColor: ['#f87979', '#f7dc6f', '#f7dc6f', '#f7dc6f', '#f7dc6f'],
                }],
                labels: ['']
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '80%',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutBounce'
                }
            }
        });
    }

    render() {
        return <canvas id="circle-progress"></canvas>;
    }
}

export default CircleProgressBar;