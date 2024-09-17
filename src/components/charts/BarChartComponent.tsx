import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface BarChartComponentProps {
  data: { name: string; count: number }[];
  xKey: string;
  yKey: string;
  title: string;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ data, xKey, yKey, title }) => {
  return (
    <div>
      <h3>{title}</h3>
      <BarChart width={800} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yKey} fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default BarChartComponent;
