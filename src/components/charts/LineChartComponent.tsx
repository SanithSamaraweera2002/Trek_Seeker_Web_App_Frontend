import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface LineChartComponentProps {
  data: { month: string; count: number }[];
  xKey: string;
  yKey: string;
  title: string;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ data, xKey, yKey, title }) => {
  return (
    <div>
      <h3>{title}</h3>
      <LineChart width={400} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default LineChartComponent;
