import React, { useState } from "react";
import {
  CurrencyDollarIcon,
  UserPlusIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { DateRange } from "react-date-range";
import { parse, isWithinInterval } from "date-fns";
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  PolarArea,
} from "react-chartjs-2";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const stats = [
  {
    title: "Total Revenue",
    value: 120000,
    icon: CurrencyDollarIcon,
    color: "text-green-600",
    bg: "bg-green-50",
    trend: "+12.5%",
    trendDir: "up",
    note: "Compared to last month",
    dateRange: "May 1 – May 31, 2025",
  },
  {
    title: "New Customers",
    value: 1245,
    icon: UserPlusIcon,
    color: "text-blue-600",
    bg: "bg-blue-50",
    trend: "+5.3%",
    trendDir: "up",
    note: "New signups this month",
    dateRange: "May 1 – May 31, 2025",
  },
  {
    title: "Active Accounts",
    value: 3560,
    icon: UserGroupIcon,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    trend: "-1.2%",
    trendDir: "down",
    note: "Compared to last 30 days",
    dateRange: "May 1 – May 31, 2025",
  },
  {
    title: "Growth Rate",
    value: 8.5,
    icon: ArrowTrendingUpIcon,
    color: "text-purple-600",
    bg: "bg-purple-50",
    trend: "+2.8%",
    trendDir: "up",
    note: "Month-over-month growth",
    dateRange: "May 1 – May 31, 2025",
  },
];

// Helper to parse start date from the dateRange string
const parseStartDate = (range) => {
  const [start, end] = range.split("–");
  const year = end.trim().split(",")[1];
  return parse(`${start.trim()} ${year.trim()}`, "MMM d yyyy", new Date());
};

// Map Tailwind text color classes to actual hex colors for charts
const colorMap = {
  "text-green-600": "#16a34a",
  "text-blue-600": "#2563eb",
  "text-yellow-600": "#ca8a04",
  "text-purple-600": "#7c3aed",
};

const chartTypes = [
  { value: "bar", label: "Bar Chart" },
  { value: "line", label: "Line Chart" },
  { value: "pie", label: "Pie Chart" },
  { value: "doughnut", label: "Doughnut Chart" },
  { value: "polarArea", label: "Polar Area Chart" },
];

const Dashboard = () => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-05-31"),
      key: "selection",
    },
  ]);

  // User-selected chart type for the main chart
  const [selectedChartType, setSelectedChartType] = useState("bar");

  // Filter stats by selected date range
  const filteredStats = stats.filter((stat) => {
    const startDate = parseStartDate(stat.dateRange);
    return isWithinInterval(startDate, {
      start: dateRange[0].startDate,
      end: dateRange[0].endDate,
    });
  });

  // Common chart data
  const labels = filteredStats.map((stat) => stat.title);
  const dataValues = filteredStats.map((stat) => stat.value);
  const backgroundColors = filteredStats.map(
    (stat) => colorMap[stat.color] || "#888888"
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Value",
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
        fill: selectedChartType === "line" ? false : true,
        tension: 0.3, // for line smoothing
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Stats Overview",
      },
    },
  };

  // Function to render the selected chart component
  const renderMainChart = () => {
    switch (selectedChartType) {
      case "bar":
        return <Bar options={chartOptions} data={chartData} />;
      case "line":
        return <Line options={chartOptions} data={chartData} />;
      case "pie":
        return <Pie options={chartOptions} data={chartData} />;
      case "doughnut":
        return <Doughnut options={chartOptions} data={chartData} />;
      case "polarArea":
        return <PolarArea options={chartOptions} data={chartData} />;
      default:
        return <Bar options={chartOptions} data={chartData} />;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Date Range Picker */}
      <div className=" p-4 max-w-md">
        <h2 className="text-lg font-semibold mb-2">Filter by Date Range</h2>
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setDateRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={dateRange}
          className="shadow rounded"
        />
      </div>

      {/* Chart Type Selector */}
      <div className="max-w-xs">
        <label
          htmlFor="chartType"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Select Chart Type:
        </label>
        <select
          id="chartType"
          value={selectedChartType}
          onChange={(e) => setSelectedChartType(e.target.value)}
          className="block w-full rounded border  p-2"
        >
          {chartTypes.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Metrics Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStats.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No stats in this date range.
          </div>
        ) : (
          filteredStats.map((stat, index) => (
            <div
              key={index}
              className="p-5 rounded-xl shadow-sm border bg-white hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">{stat.dateRange}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span
                  className={`font-semibold ${
                    stat.trendDir === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trendDir === "up" ? "▲" : "▼"} {stat.trend}
                </span>
                <span className="text-gray-400">{stat.note}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Main Chart - user selectable type */}
      <div className="bg-white p-6 shadow-md rounded-lg max-w-4xl mx-auto">
        {filteredStats.length > 0 ? (
          renderMainChart()
        ) : (
          <p className="text-center text-gray-500">No chart data for this range.</p>
        )}
      </div>

      {/* Additional Charts - Fixed types for variety */}
      {filteredStats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Pie Chart</h3>
            <Pie options={chartOptions} data={chartData} />
          </div>

          <div className="bg-white p-6 shadow-md rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Polar Area Chart</h3>
            <PolarArea options={chartOptions} data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
