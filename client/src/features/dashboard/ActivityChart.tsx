import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MOCK_WEEKLY_DATA = [
  { day: 'Mon', xp: 40 },
  { day: 'Tue', xp: 120 },
  { day: 'Wed', xp: 30 },
  { day: 'Thu', xp: 200 },
  { day: 'Fri', xp: 90 },
  { day: 'Sat', xp: 150 },
  { day: 'Sun', xp: 60 },
];

export const ActivityChart = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={MOCK_WEEKLY_DATA}>
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold' }} 
            dy={10}
          />
          <Tooltip 
            cursor={{ fill: '#F3F4F6' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
            {MOCK_WEEKLY_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.xp > 100 ? '#2563EB' : '#E5E7EB'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
