import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

interface PieChartComponentProps {
  data: { name: string; value: number }[];
  dataKey: string;
  nameKey: string;
  title: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data, dataKey, nameKey, title }) => {
  return (
    <div>
      <h3>{title}</h3>
      <PieChart width={450} height={300}>
        <Pie
          data={data}
          cx={200}
          cy={150}
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
