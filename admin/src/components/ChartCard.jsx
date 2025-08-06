import React from 'react';
import { chartTypes } from '../constants';

const ChartCard = ({ title, chart, value, colorClass, chartTypeKey, chartType, setChartType }) => (
  <div className="bg-white rounded shadow p-6 flex flex-col items-center">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <div className="w-full h-48 flex items-center justify-center">
      {chart}
    </div>
    <div className={`mt-4 text-2xl font-bold ${colorClass}`}>{value}</div>
    <div className="mt-2">
      <select
        value={chartType[chartTypeKey]}
        onChange={e => setChartType(t => ({ ...t, [chartTypeKey]: e.target.value }))}
        className="border rounded px-2 py-1"
      >
        {chartTypes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
      </select>
    </div>
  </div>
);

export default ChartCard;
