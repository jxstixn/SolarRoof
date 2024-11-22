import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js modules
ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutChart() {
    const data = {
        labels: ['Value 1', 'Value 2', 'Value 3'],
        datasets: [
            {
                label: 'Dataset',
                data: [300, 50, 100],
                backgroundColor: [
                    '#0D4054',
                    '#3D7B94',
                    '#8CBFD4',
                ],
                borderColor: [
                    '#0D4054',
                    '#3D7B94',
                    '#8CBFD4',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false, // Hide the legend
            },
        },
    };

    return (
            <Doughnut data={data} options={options} />
    );
}

export default DoughnutChart;