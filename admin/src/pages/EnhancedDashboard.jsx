import React, { useState, useEffect } from 'react';
import { getProducts } from '../lib/productApi';
import { getBrands } from '../lib/brandApi';
import { getMainCategories } from '../lib/categoryApi';
import { getDiseases } from '../lib/diseaseApi';
import { getCustomers } from '../lib/customerApi';
import { getOrders } from '../lib/orderApi';
import {
  CubeIcon,
  TagIcon,
  FolderIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  StarIcon,
  UsersIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ClockIcon
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
import { Bar, Line } from "react-chartjs-2";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import ChartCard from '../components/ChartCard';
import { exportToExcel } from '../lib/exportToExcel';
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

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return `₹${parseFloat(amount || 0).toLocaleString('en-IN')}`;
};

const EnhancedDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    brands: 0,
    categories: 0,
    diseases: 0,
    customers: 0,
    orders: 0,
    totalSales: 0,
    seasonalProducts: 0,
    topProducts: 0,
    frequentlyBought: 0,
    peoplePreferred: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  
  // Chart-related state
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
    status: 'bar',
    ordersTrend: 'line',
    revenueTrend: 'line',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {
      const [products, brands, categories, diseases, customersData, ordersData] = await Promise.all([
        getProducts().catch(() => []),
        getBrands().catch(() => []),
        getMainCategories().catch(() => []),
        getDiseases().catch(() => []),
        getCustomers().catch(() => []),
        getOrders().catch(() => [])
      ]);

      // Store full data for charts
      setCustomers(customersData);
      setOrders(ordersData);

      // Calculate product statistics
      const seasonalProducts = products.filter(p => p.seasonal_medicine).length;
      const topProducts = products.filter(p => p.top_products).length;
      const frequentlyBought = products.filter(p => p.frequently_bought).length;
      const peoplePreferred = products.filter(p => p.people_preferred).length;

      // Calculate sales total
      const totalSales = ordersData.reduce((sum, order) => {
        return sum + (parseFloat(order.total_amount) || 0);
      }, 0);

      setStats({
        products: products.length,
        brands: brands.length,
        categories: categories.length,
        diseases: diseases.length,
        customers: customersData.length,
        orders: ordersData.length,
        totalSales,
        seasonalProducts,
        topProducts,
        frequentlyBought,
        peoplePreferred
      });

      // Get recent products (last 5)
      const recentProductsList = products
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentProducts(recentProductsList);

      // Get recent orders (last 5)
      const recentOrdersList = ordersData
        .sort((a, b) => new Date(b.created_at || b.order_date) - new Date(a.created_at || a.order_date))
        .slice(0, 5);
      setRecentOrders(recentOrdersList);
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
      name: 'Total Customers',
      value: stats.customers,
      icon: UsersIcon,
      color: 'bg-green-500',
      href: '/customers'
    },
    {
      name: 'Total Orders',
      value: stats.orders,
      icon: ShoppingCartIcon,
      color: 'bg-orange-500',
      href: '/orders'
    },
    {
      name: 'Total Sales',
      value: formatCurrency(stats.totalSales),
      icon: CurrencyDollarIcon,
      color: 'bg-emerald-500',
      href: '/orders'
    },
    // {
    //   name: 'Total Brands',
    //   value: stats.brands,
    //   icon: TagIcon,
    //   color: 'bg-purple-500',
    //   href: '/brand-management'
    // },
    // {
    //   name: 'Categories',
    //   value: stats.categories,
    //   icon: FolderIcon,
    //   color: 'bg-yellow-500',
    //   href: '/products'
    // },
    // {
    //   name: 'Diseases',
    //   value: stats.diseases,
    //   icon: UserGroupIcon,
    //   color: 'bg-pink-500',
    //   href: '/products'
    // }
  ];

  // Chart calculations
  const parseDate = obj => new Date(obj.order_date || obj.date || obj.createdAt || obj.created_at);

  const filteredOrders = orders.filter(o => {
    const d = parseDate(o);
    return d >= startDate && d <= endDate;
  });

  const filteredCustomers = customers.filter(c => {
    const d = new Date(c.createdAt || c.created_at);
    return d >= startDate && d <= endDate;
  });

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const newCustomerCount = filteredCustomers.length;
  const activeCustomerIds = new Set(filteredOrders.map(o => o.customer_id));
  const activeCustomers = customers.filter(c => activeCustomerIds.has(c.id));
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Chart data for trends
  const dayMap = {};
  const revMap = {};
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    dayMap[key] = 0;
    revMap[key] = 0;
  }
  filteredOrders.forEach(o => {
    const d = parseDate(o).toISOString().slice(0, 10);
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

  // Chart options
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

  // Chart data configurations
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome to HerbalMG Admin Panel
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Picker and Export Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <label className="font-medium text-gray-700">From:</label>
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={endDate}
                  className="border border-gray-300 rounded px-3 py-2 w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-medium text-gray-700">To:</label>
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="border border-gray-300 rounded px-3 py-2 w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>
            
            {/* <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => exportToExcel(filteredOrders, 'Orders')}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors"
              >
                Export Orders
              </button>
              <button
                onClick={() => exportToExcel(filteredCustomers, 'Customers')}
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition-colors"
              >
                Export Customers
              </button>
            </div> */}
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow-md p-4 lg:p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} p-2 lg:p-3 rounded-lg`}>
                    <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div className="ml-3 lg:ml-4 min-w-0 flex-1">
                    <p className="text-xs lg:text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                    <p className="text-lg lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Product Statistics and Recent Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h2>
            <div className="grid grid-cols-1 gap-4">
              {productStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.name} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className={`${stat.color} p-2 rounded`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">{stat.name}</p>
                      <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h2>
            <div className="space-y-3">
              {recentProducts.length > 0 ? recentProducts.map((product) => (
                <div key={product.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  {product.images && product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-10 w-10 rounded object-cover mr-3"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      {product.brand_name} • ₹{product.selling_price}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    {product.seasonal_medicine && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Seasonal
                      </span>
                    )}
                    {product.top_products && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Top
                      </span>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-gray-500">
                  No recent products
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <div key={order.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-500 p-2 rounded-full mr-3">
                    <ShoppingCartIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order.id || order.order_number}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.customer_name || 'Customer'} • {new Date(order.created_at || order.order_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status || 'pending'}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-gray-500">
                  No recent orders
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/product-management"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <CubeIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-blue-900">Manage Products</p>
                <p className="text-sm text-blue-600">Add, edit, or delete products</p>
              </div>
            </a>
            <a
              href="/orders"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <ShoppingCartIcon className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="font-medium text-orange-900">View Orders</p>
                <p className="text-sm text-orange-600">Manage customer orders</p>
              </div>
            </a>
            <a
              href="/customers"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <UsersIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-green-900">Manage Customers</p>
                <p className="text-sm text-green-600">View and manage customers</p>
              </div>
            </a>
            <a
              href="/brand-management"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <TagIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-purple-900">Manage Brands</p>
                <p className="text-sm text-purple-600">Add, edit, or delete brands</p>
              </div>
            </a>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="space-y-8">
          {/* Stats Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-2">
            <ChartCard
              title="Total Orders"
              chart={chartComponent(chartType.orders, ordersChart)}
              value={totalOrders}
              colorClass="text-blue-600"
              chartTypeKey="orders"
              chartType={chartType}
              setChartType={setChartType}
            />
            <ChartCard
              title="Total Revenue"
              chart={chartComponent(chartType.revenue, revenueChart)}
              value={formatCurrency(totalRevenue)}
              colorClass="text-green-600"
              chartTypeKey="revenue"
              chartType={chartType}
              setChartType={setChartType}
            />
            <ChartCard
              title="New Customers"
              chart={chartComponent(chartType.customers, customersChart)}
              value={newCustomerCount}
              colorClass="text-purple-600"
              chartTypeKey="customers"
              chartType={chartType}
              setChartType={setChartType}
            />
            <ChartCard
              title="Active Customers"
              chart={chartComponent(chartType.active, activeChart)}
              value={activeCustomers.length}
              colorClass="text-orange-600"
              chartTypeKey="active"
              chartType={chartType}
              setChartType={setChartType}
            />
            <ChartCard
              title="Avg Order Value"
              chart={chartComponent(chartType.avg, avgChart)}
              value={formatCurrency(avgOrderValue)}
              colorClass="text-red-600"
              chartTypeKey="avg"
              chartType={chartType}
              setChartType={setChartType}
            />
          </div>

          {/* Order Status Distribution */}
          <div className="grid grid-cols-1 gap-8">
            <ChartCard
              title="Order Status Distribution"
              chart={chartComponent(chartType.status, statusChart)}
              value=""
              colorClass=""
              chartTypeKey="status"
              chartType={chartType}
              setChartType={setChartType}
            />
          </div>

          {/* Trends */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ChartCard
              title="Orders per Day"
              chart={chartComponent(chartType.ordersTrend, ordersTrendChart)}
              value=""
              colorClass=""
              chartTypeKey="ordersTrend"
              chartType={chartType}
              setChartType={setChartType}
            />
            <ChartCard
              title="Revenue per Day"
              chart={chartComponent(chartType.revenueTrend, revenueTrendChart)}
              value=""
              colorClass=""
              chartTypeKey="revenueTrend"
              chartType={chartType}
              setChartType={setChartType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;