import React from "react";

import {
  CurrencyDollarIcon,
  UserPlusIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    title: 'Total Revenue',
    value: '$120,000',
    icon: CurrencyDollarIcon,
    color: 'text-green-600',
    bg: 'bg-green-50',
    trend: '+12.5%',
    trendDir: 'up',
    note: 'Compared to last month',
  },
  {
    title: 'New Customers',
    value: '1,245',
    icon: UserPlusIcon,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    trend: '+5.3%',
    trendDir: 'up',
    note: 'New signups this month',
  },
  {
    title: 'Active Accounts',
    value: '3,560',
    icon: UserGroupIcon,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    trend: '-1.2%',
    trendDir: 'down',
    note: 'Compared to last 30 days',
  },
  {
    title: 'Growth Rate',
    value: '8.5%',
    icon: ArrowTrendingUpIcon,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    trend: '+2.8%',
    trendDir: 'up',
    note: 'Month-over-month growth',
  },
];



const Dashboard = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Metrics Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {stats.map((stat, index) => (
    <div
      key={index}
      className={`p-5 rounded-xl shadow-sm border bg-white hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${stat.bg}`}>
          <stat.icon className={`h-6 w-6 ${stat.color}`} /> 
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
          <h2 className="text-2xl font-bold text-gray-900">{stat.value}</h2>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span
          className={`font-semibold ${
            stat.trendDir === 'up' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {stat.trendDir === 'up' ? '▲' : '▼'} {stat.trend}
        </span>
        <span className="text-gray-400">{stat.note}</span>
      </div>
    </div>
  ))}
</div>


      {/* Chart Section */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Customer Visitors</h2>
        {/* Replace with your chart component */}
        <div className="w-full h-64 flex items-center justify-center text-gray-500 border border-dashed rounded-lg">
          Chart goes here (e.g. Recharts / Chart.js)
        </div>
      </div>

      {/* Add More Sections Below as Needed */}
      {/* <Chart /> */}
    </div>
  );
};

export default Dashboard;
