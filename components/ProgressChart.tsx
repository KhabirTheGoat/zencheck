
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ProgressChartProps {
  completed: number;
  total: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ completed, total }) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  const data = [
    { name: 'Completed', value: completed },
    { name: 'Remaining', value: Math.max(0, total - completed) },
  ];

  const COLORS = ['#10b981', '#e2e8f0']; // Emerald-500 and Slate-200

  return (
    <div className="relative w-48 h-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-slate-800">{percentage}%</span>
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Done</span>
      </div>
    </div>
  );
};

export default ProgressChart;
