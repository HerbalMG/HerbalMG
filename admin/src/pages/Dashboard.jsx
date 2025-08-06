// import React, { useState, useEffect } from "react";
// import {
//   CurrencyDollarIcon,
//   UserPlusIcon,
//   UserGroupIcon,
//   ArrowTrendingUpIcon,
// } from "@heroicons/react/24/outline";
// import { parse, isWithinInterval } from "date-fns";


// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   RadialLinearScale,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   RadialLinearScale,
//   Title,
//   Tooltip,
//   Legend
// );

// import { getCustomers } from '../lib/customerApi';
// import { getOrders } from '../lib/orderApi';
// import {
//   Bar,
//   Pie,
//   Doughnut,
//   Line,
//   PolarArea,
// } from 'react-chartjs-2';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const chartTypes = [
//   { value: 'bar', label: 'Bar' },
//   { value: 'line', label: 'Line' },
//   { value: 'pie', label: 'Pie' },
//   { value: 'doughnut', label: 'Doughnut' },
//   { value: 'polarArea', label: 'Polar Area' },
// ];

// const colorMap = {
//   'orders': '#2563eb',
//   'revenue': '#16a34a',
//   'customers': '#ca8a04',
//   'active': '#7c3aed',
//   'avg': '#f59e42',
//   'status': ['#2563eb', '#16a34a', '#ca8a04', '#f59e42', '#e11d48'],
// };

// const statusLabels = ['Ordered', 'Shipped', 'Delivered', 'Returned', 'Refunded'];

// const Dashboard = () => {
//   const [orders, setOrders] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
//   const [endDate, setEndDate] = useState(new Date());
//   // Chart type per metric
//   const [chartType, setChartType] = useState({
//     orders: 'bar',
//     revenue: 'doughnut',
//     customers: 'pie',
//     active: 'bar',
//     avg: 'bar',
//     status: 'pie',
//     ordersTrend: 'line',
//     revenueTrend: 'line',
//   });

//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       getOrders().catch(() => []),
//       getCustomers().catch(() => []),
//     ]).then(([ordersData, customersData]) => {
//       setOrders(ordersData);
//       setCustomers(customersData);
//       setLoading(false);
//     });
//   }, []);

//   // Filter by date range
//   const start = startDate;
//   const end = endDate;
//   const filteredOrders = orders.filter(o => {
//     const d = new Date(o.order_date || o.date || o.createdAt || o.created_at);
//     return d >= start && d <= end;
//   });
//   const filteredCustomers = customers.filter(c => {
//     const d = new Date(c.createdAt || c.created_at);
//     return d >= start && d <= end;
//   });

//   // Metrics
//   const totalOrders = filteredOrders.length;
//   const totalRevenue = filteredOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
//   const newCustomerCount = filteredCustomers.length;
//   // Active customers: those who placed at least one order in range
//   const activeCustomerIds = new Set(filteredOrders.map(o => o.customer_id));
//   const activeCustomers = customers.filter(c => activeCustomerIds.has(c.id));
//   const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
//   // Orders per day
//   const dayMap = {};
//   const revMap = {};
//   for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//     const key = d.toISOString().slice(0, 10);
//     dayMap[key] = 0;
//     revMap[key] = 0;
//   }
//   filteredOrders.forEach(o => {
//     const d = new Date(o.order_date || o.date || o.createdAt || o.created_at).toISOString().slice(0, 10);
//     if (dayMap[d] !== undefined) {
//       dayMap[d]++;
//       revMap[d] += Number(o.total_amount || 0);
//     }
//   });
//   const ordersPerDayLabels = Object.keys(dayMap);
//   const ordersPerDayData = Object.values(dayMap);
//   const revenuePerDayData = Object.values(revMap);
//   // Order status breakdown
//   const statusCounts = statusLabels.map(status => filteredOrders.filter(o => o.status === status).length);

//   // Chart data
//   const ordersChart = {
//     labels: ['Orders'],
//     datasets: [{
//       label: 'Total Orders',
//       data: [totalOrders],
//       backgroundColor: [colorMap.orders],
//     }],
//   };
//   const revenueChart = {
//     labels: ['Revenue'],
//     datasets: [{
//       label: 'Total Revenue',
//       data: [totalRevenue],
//       backgroundColor: [colorMap.revenue],
//     }],
//   };
//   const customersChart = {
//     labels: ['New Customers'],
//     datasets: [{
//       label: 'New Customers',
//       data: [newCustomerCount],
//       backgroundColor: [colorMap.customers],
//     }],
//   };
//   const activeChart = {
//     labels: ['Active Customers'],
//     datasets: [{
//       label: 'Active Customers',
//       data: [activeCustomers.length],
//       backgroundColor: [colorMap.active],
//     }],
//   };
//   const avgChart = {
//     labels: ['Avg Order Value'],
//     datasets: [{
//       label: 'Avg Order Value',
//       data: [avgOrderValue],
//       backgroundColor: [colorMap.avg],
//     }],
//   };
//   const statusChart = {
//     labels: statusLabels,
//     datasets: [{
//       label: 'Order Status',
//       data: statusCounts,
//       backgroundColor: colorMap.status,
//     }],
//   };
//   const ordersTrendChart = {
//     labels: ordersPerDayLabels,
//     datasets: [{
//       label: 'Orders per Day',
//       data: ordersPerDayData,
//       backgroundColor: colorMap.orders,
//       borderColor: colorMap.orders,
//       fill: false,
//     }],
//   };
//   const revenueTrendChart = {
//     labels: ordersPerDayLabels,
//     datasets: [{
//       label: 'Revenue per Day',
//       data: revenuePerDayData,
//       backgroundColor: colorMap.revenue,
//       borderColor: colorMap.revenue,
//       fill: false,
//     }],
//   };

//   const chartComponent = (type, data) => {
//     switch (type) {
//       case 'bar': return <Bar data={data} options={{ plugins: { legend: { display: false } } }} />;
//       case 'line': return <Line data={data} options={{ plugins: { legend: { display: false } } }} />;
//       case 'pie': return <Pie data={data} options={{ plugins: { legend: { display: false } } }} />;
//       case 'doughnut': return <Doughnut data={data} options={{ plugins: { legend: { display: false } } }} />;
//       case 'polarArea': return <PolarArea data={data} options={{ plugins: { legend: { display: false } } }} />;
//       default: return <Bar data={data} options={{ plugins: { legend: { display: false } } }} />;
//     }
//   };

//   if (loading) {
//     return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
//   }

//   return (
//     <div className="p-6 space-y-8">
//       {/* Minimal Date Range Picker */}
//       <div className="flex gap-2 items-center mb-4">
//         <label className="font-medium">From:</label>
//         <DatePicker
//           selected={startDate}
//           onChange={date => setStartDate(date)}
//           selectsStart
//           startDate={startDate}
//           endDate={endDate}
//           maxDate={endDate}
//           className="border rounded px-2 py-1 w-32"
//           dateFormat="yyyy-MM-dd"
//         />
//         <label className="font-medium">To:</label>
//         <DatePicker
//           selected={endDate}
//           onChange={date => setEndDate(date)}
//           selectsEnd
//           startDate={startDate}
//           endDate={endDate}
//           minDate={startDate}
//           className="border rounded px-2 py-1 w-32"
//           dateFormat="yyyy-MM-dd"
//         />
//       </div>
//       {/* Metrics Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {/* Orders Stat */}
//         <div className="bg-white rounded shadow p-6 flex flex-col items-center">
//           <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
//           <div className="w-full h-48 flex items-center justify-center">
//             {chartComponent(chartType.orders, ordersChart)}
//           </div>
//           <div className="mt-4 text-2xl font-bold text-blue-600">{totalOrders}</div>
//           <div className="mt-2">
//             <select value={chartType.orders} onChange={e => setChartType(t => ({ ...t, orders: e.target.value }))} className="border rounded px-2 py-1">
//               {chartTypes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
//             </select>
//           </div>
//         </div>
//         {/* Revenue Stat */}
//         <div className="bg-white rounded shadow p-6 flex flex-col items-center">
//           <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
//           <div className="w-full h-48 flex items-center justify-center">
//             {chartComponent(chartType.revenue, revenueChart)}
//           </div>
//           <div className="mt-4 text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
//           <div className="mt-2">
//             <select value={chartType.revenue} onChange={e => setChartType(t => ({ ...t, revenue: e.target.value }))} className="border rounded px-2 py-1">
//               {chartTypes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
//             </select>
//           </div>
//         </div>
//         {/* New Customers Stat */}
//         <div className="bg-white rounded shadow p-6 flex flex-col items-center">
//           <h2 className="text-lg font-semibold mb-2">New Customers</h2>
//           <div className="w-full h-48 flex items-center justify-center">
//             {chartComponent(chartType.customers, customersChart)}
//           </div>
//           <div className="mt-4 text-2xl font-bold text-yellow-600">{newCustomerCount}</div>
//           <div className="mt-2">
//             <select value={chartType.customers} onChange={e => setChartType(t => ({ ...t, customers: e.target.value }))} className="border rounded px-2 py-1">
//               {chartTypes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
//             </select>
//           </div>
//         </div>
//         {/* Active Customers Stat */}
//         <div className="bg-white rounded shadow p-6 flex flex-col items-center">
//           <h2 className="text-lg font-semibold mb-2">Active Customers</h2>
//           <div className="w-full h-48 flex items-center justify-center">
//             {chartComponent(chartType.active, activeChart)}
//           </div>
//           <div className="mt-4 text-2xl font-bold text-purple-600">{activeCustomers.length}</div>
//           <div className="mt-2">
//             <select value={chartType.active} onChange={e => setChartType(t => ({ ...t, active: e.target.value }))} className="border rounded px-2 py-1">
//               {chartTypes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
//             </select>
//           </div>
//         </div>
//         {/* Average Order Value Stat */}
//         <div className="bg-white rounded shadow p-6 flex flex-col items-center">
//           <h2 className="text-lg font-semibold mb-2">Avg Order Value</h2>
//           <div className="w-full h-48 flex items-center justify-center">
//             {chartComponent(chartType.avg, avgChart)}
//           </div>
//           <div className="mt-4 text-2xl font-bold text-orange-600">₹{avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
//           <div className="mt-2">
//             <select value={chartType.avg} onChange={e => setChartType(t => ({ ...t, avg: e.target.value }))} className="border rounded px-2 py-1">
//               {chartTypes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
//             </select>
//           </div>
//         </div>
//         {/* Order Status Breakdown */}
//         <div className="bg-white rounded shadow p-6 flex flex-col items-center">
//           <h2 className="text-lg font-semibold mb-2">Order Status Breakdown</h2>
//           <div className="w-full h-48 flex items-center justify-center">
//             {chartComponent(chartType.status, statusChart)}
//           </div>
//           <div className="mt-4 text-2xl font-bold text-pink-600">{statusLabels.map((s, i) => statusCounts[i] > 0 ? `${s}: ${statusCounts[i]}` : null).filter(Boolean).join(' | ')}</div>
//           <div className="mt-2">
//             <select value={chartType.status} onChange={e => setChartType(t => ({ ...t, status: e.target.value }))} className="border rounded px-2 py-1">
//               {chartTypes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
//             </select>
//           </div>
//         </div>
//       </div>
//       {/* Trends */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
//         <div className="bg-white rounded shadow p-6 flex flex-col items-center">
//           <h2 className="text-lg font-semibold mb-2">Orders per Day</h2>
//           <div className="w-full h-64 flex items-center justify-center">
//             {chartComponent(chartType.ordersTrend, ordersTrendChart)}
//           </div>
//           <div className="mt-2">
//             <select value={chartType.ordersTrend} onChange={e => setChartType(t => ({ ...t, ordersTrend: e.target.value }))} className="border rounded px-2 py-1">
//               {chartTypes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
//             </select>
//           </div>
//         </div>
//         <div className="bg-white rounded shadow p-6 flex flex-col items-center">
//           <h2 className="text-lg font-semibold mb-2">Revenue per Day</h2>
//           <div className="w-full h-64 flex items-center justify-center">
//             {chartComponent(chartType.revenueTrend, revenueTrendChart)}
//           </div>
//           <div className="mt-2">
//             <select value={chartType.revenueTrend} onChange={e => setChartType(t => ({ ...t, revenueTrend: e.target.value }))} className="border rounded px-2 py-1">
//               {chartTypes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
//             </select>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from "react";
import { getProducts } from '../lib/productApi';
import { getBrands } from '../lib/brandApi';
import { getMainCategories } from '../lib/mainCategoryApi';
import { getDiseases } from '../lib/diseaseApi';
import { getCustomers } from '../lib/customerApi';
import { getOrders } from '../lib/orderApi';
import {
  CubeIcon,
  TagIcon,
  FolderIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  StarIcon
} from '@heroicons/react/24/outline';
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
import { Bar, Pie, Doughnut, Line, PolarArea } from "react-chartjs-2";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// import ChartCard from '../components/ChartCard';
// import { exportToExcel } from '../lib/exportToExcel';
import { chartTypes, colorMap, statusLabels } from '../constants';

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

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    brands: 0,
    categories: 0,
    diseases: 0,
    seasonalProducts: 0,
    topProducts: 0,
    frequentlyBought: 0,
    peoplePreferred: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [chartType, setChartType] = useState({
    orders: 'bar',
    revenue: 'bar',
    customers: 'bar',
    active: 'bar',
    avg: 'bar',
    status: 'pie',
    ordersTrend: 'line',
    revenueTrend: 'line',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {
      const [products, brands, categories, diseases, ordersData, customersData] = await Promise.all([
        getProducts().catch(() => []),
        getBrands().catch(() => []),
        getMainCategories().catch(() => []),
        getDiseases().catch(() => []),
        getOrders().catch(() => []),
        getCustomers().catch(() => [])
      ]);

      // Calculate product statistics
      const seasonalProducts = products.filter(p => p.seasonal_medicine).length;
      const topProducts = products.filter(p => p.top_products).length;
      const frequentlyBought = products.filter(p => p.frequently_bought).length;
      const peoplePreferred = products.filter(p => p.people_preferred).length;

      setStats({
        products: products.length,
        brands: brands.length,
        categories: categories.length,
        diseases: diseases.length,
        seasonalProducts,
        topProducts,
        frequentlyBought,
        peoplePreferred
      });

      setOrders(ordersData);
      setCustomers(customersData);

      // Get recent products (last 5)
      const recent = products
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentProducts(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Products',
      value: stats.products,
      icon: CubeIcon,
      color: 'bg-blue-500',
      href: '/product-management'
    },
    {
      name: 'Total Brands',
      value: stats.brands,
      icon: TagIcon,
      color: 'bg-green-500',
      href: '/brand-management'
    },
    {
      name: 'Categories',
      value: stats.categories,
      icon: FolderIcon,
      color: 'bg-yellow-500',
      href: '/products'
    },
    {
      name: 'Diseases',
      value: stats.diseases,
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      href: '/products'
    }
  ];

  const productStats = [
    {
      name: 'Seasonal Products',
      value: stats.seasonalProducts,
      icon: ArrowTrendingUpIcon,
      color: 'bg-orange-500'
    },
    {
      name: 'Top Products',
      value: stats.topProducts,
      icon: StarIcon,
      color: 'bg-red-500'
    },
    {
      name: 'Frequently Bought',
      value: stats.frequentlyBought,
      icon: ArrowTrendingUpIcon,
      color: 'bg-indigo-500'
    },
    {
      name: 'People Preferred',
      value: stats.peoplePreferred,
      icon: StarIcon,
      color: 'bg-pink-500'
    }
  ];

  // Filter by date range
  const start = startDate;
  const end = endDate;
  const filteredOrders = orders.filter(o => {
    const d = new Date(o.order_date || o.date || o.createdAt || o.created_at);
    return d >= start && d <= end;
  });
  const filteredCustomers = customers.filter(c => {
    const d = new Date(c.createdAt || c.created_at);
    return d >= start && d <= end;
  });

  // Metrics
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const newCustomerCount = filteredCustomers.length;
  // Active customers: those who placed at least one order in range
  const activeCustomerIds = new Set(filteredOrders.map(o => o.customer_id));
  const activeCustomers = customers.filter(c => activeCustomerIds.has(c.id));
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const dayMap = {};
  const revMap = {};
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    dayMap[key] = 0;
    revMap[key] = 0;
  }
  filteredOrders.forEach(o => {
    const d = new Date(o.order_date || o.date || o.createdAt || o.created_at).toISOString().slice(0, 10);
    if (dayMap[d] !== undefined) {
      dayMap[d]++;
      revMap[d] += Number(o.total_amount || 0);
    }
  });

  const ordersPerDayLabels = Object.keys(dayMap);
  const ordersPerDayData = Object.values(dayMap);
  const revenuePerDayData = Object.values(revMap);

  const statusCounts = statusLabels.map(status =>
    filteredOrders.filter(o => o.status === status).length
  );

  const baseChartOptions = {
    plugins: {
      legend: {
        display: window.innerWidth >= 768,
        position: 'bottom',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const chartComponent = (type, data) => {
    switch (type) {
      case 'bar': return <Bar data={data} options={baseChartOptions} />;
      case 'line': return <Line data={data} options={baseChartOptions} />;
      default: return <Bar data={data} options={baseChartOptions} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const ordersChart = {
    labels: ['Orders'],
    datasets: [{
      label: 'Total Orders',
      data: [totalOrders],
      backgroundColor: [colorMap.orders],
    }],
  };

  const revenueChart = {
    labels: ['Revenue'],
    datasets: [{
      label: 'Total Revenue',
      data: [totalRevenue],
      backgroundColor: [colorMap.revenue],
    }],
  };

  const customersChart = {
    labels: ['New Customers'],
    datasets: [{
      label: 'New Customers',
      data: [newCustomerCount],
      backgroundColor: [colorMap.customers],
    }],
  };

  const activeChart = {
    labels: ['Active Customers'],
    datasets: [{
      label: 'Active Customers',
      data: [activeCustomers.length],
      backgroundColor: [colorMap.active],
    }],
  };

  const avgChart = {
    labels: ['Avg Order Value'],
    datasets: [{
      label: 'Avg Order Value',
      data: [avgOrderValue],
      backgroundColor: [colorMap.avg],
    }],
  };

  const statusChart = {
    labels: statusLabels,
    datasets: [{
      label: 'Order Status',
      data: statusCounts,
      backgroundColor: colorMap.status,
    }],
  };

  const ordersTrendChart = {
    labels: ordersPerDayLabels,
    datasets: [{
      label: 'Orders per Day',
      data: ordersPerDayData,
      backgroundColor: colorMap.orders,
      borderColor: colorMap.orders,
      fill: false,
    }],
  };

  const revenueTrendChart = {
    labels: ordersPerDayLabels,
    datasets: [{
      label: 'Revenue per Day',
      data: revenuePerDayData,
      backgroundColor: colorMap.revenue,
      borderColor: colorMap.revenue,
      fill: false,
    }],
  };

  return (
    <div className="p-6 space-y-8">
      {/* Date Picker */}
      <div className="flex gap-2 items-center mb-4">
        <label className="font-medium">From:</label>
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          maxDate={endDate}
          className="border rounded px-2 py-1 w-32"
          dateFormat="yyyy-MM-dd"
        />
        <label className="font-medium">To:</label>
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          className="border rounded px-2 py-1 w-32"
          dateFormat="yyyy-MM-dd"
        />
      </div>



      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${card.color} rounded-md p-3`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {productStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-md p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
          <div className="w-full h-48 flex items-center justify-center">
            {chartComponent(chartType.orders, ordersChart)}
          </div>
          <div className="mt-4 text-2xl font-bold text-blue-600">{totalOrders}</div>
        </div>
        
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
          <div className="w-full h-48 flex items-center justify-center">
            {chartComponent(chartType.revenue, revenueChart)}
          </div>
          <div className="mt-4 text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
        </div>
        
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">New Customers</h2>
          <div className="w-full h-48 flex items-center justify-center">
            {chartComponent(chartType.customers, customersChart)}
          </div>
          <div className="mt-4 text-2xl font-bold text-yellow-600">{newCustomerCount}</div>
        </div>
      </div>

      {/* Recent Products */}
      {recentProducts.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Products</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-sm text-green-600">₹{product.selling_price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
