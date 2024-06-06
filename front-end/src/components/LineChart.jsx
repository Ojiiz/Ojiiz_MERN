import React, { PureComponent } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const data = [
    {
        name: 'Monday',
        'Total Jobs': 3609,
        'AI/ML': 1540,
    },
    {
        name: 'Tuesday',
        'Total Jobs': 3000,
        'AI/ML': 1498,
    },
    {
        name: 'Wednesday',
        'Total Jobs': 2000,
        'AI/ML': 1754,
    },
    {
        name: 'Thursday',
        'Total Jobs': 2780,
        'AI/ML': 1804,
    },
    {
        name: 'Friday',
        'Total Jobs': 1890,
        'AI/ML': 1691,
    },
    {
        name: 'Saturday',
        'Total Jobs': 2390,
        'AI/ML': 1633,
    },
    {
        name: 'Sunday',
        'Total Jobs': 3490,
        'AI/ML': 1970,
    },
];

export default class Example extends PureComponent {
    render() {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Total Jobs" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="AI/ML" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}
