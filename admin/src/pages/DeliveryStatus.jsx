import React, { useEffect, useState } from 'react';

// Simulated API fetch function
const simulateFetch = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Array.from({ length: 50 }, (_, i) => ({
        srNo: i + 1,
        invoice: `INV${100000 + i}`,
        status: ['Delivered', 'In Transit', 'Pending'][i % 3],
        paymentMode: ['Credit Card', 'UPI', 'Cash on Delivery'][i % 3],
        customer: {
          name: ['John Doe', 'Jane Smith', 'Rahul Verma'][i % 3],
          id: `C${String(i + 1).padStart(3, '0')}`,
        },
        orderId: `ORD${5000 + i}`,
        city: ['Mumbai', 'Delhi', 'Bangalore'][i % 3],
        pincode: [400001, 110001, 560001][i % 3],
        orderDate: new Date(Date.now() - i * 86400000),
        transitDate: new Date(Date.now() - (i - 1) * 86400000),
        deliveryDate: new Date(Date.now() - (i - 2) * 86400000),
      })));
    }, 1000);
  });
};

const statusColors = {
  Delivered: 'bg-green-100 text-green-800',
  'In Transit': 'bg-yellow-100 text-yellow-800',
  Pending: 'bg-red-100 text-red-800',
};

export default function DeliveryStatusTable() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const res = await simulateFetch();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const isDelayed = (status, orderDate) => {
    if (status !== 'Pending') return false;
    const now = new Date();
    const days = (now - new Date(orderDate)) / (1000 * 60 * 60 * 24);
    return days > 7;
  };

  const filtered = data
    .filter(item =>
  item.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
  item.paymentMode.toLowerCase().includes(searchTerm.toLowerCase()) 
)

    .filter(item => statusFilter === 'All' || item.status === statusFilter)
    .filter(item => {
      const orderDate = new Date(item.orderDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && orderDate < start) return false;
      if (end && orderDate > end) return false;
      return true;
    });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pageData = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (delta) => {
    const next = currentPage + delta;
    if (next >= 1 && next <= totalPages) setCurrentPage(next);
  };

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500 animate-pulse">Loading orders...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-wrap gap-4 justify-between">
        <input
          type="text"
          placeholder="Search "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-1 rounded text-sm"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="All">All Statuses</option>
          <option value="Delivered">Delivered</option>
          <option value="In Transit">In Transit</option>
          <option value="Pending">Pending</option>
        </select>
        <select
          value={rowsPerPage}
          onChange={handleRowsChange}
          className="border px-2 py-1 rounded text-sm"
        >
          {[10, 25, 50].map(n => <option key={n} value={n}>{n} per page</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 table-auto">
          <thead className="bg-blue-100 sticky top-0">
            <tr className="text-left text-gray-700">
              <th className="border p-2">Sr. No.</th>
              <th className="border p-2">Invoice</th>
              <th className="border p-2">Customer ID</th>
              <th className="border p-2">Customer Name</th>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Order Date</th>
              <th className="border p-2">Delivery Date</th>
              <th className="border p-2">Payment</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length ? pageData.map((item, index) => (
              <tr
                key={item.invoice}
                className={`hover:bg-gray-100 ${isDelayed(item.status, item.orderDate) ? 'border-l-4 border-red-500' : ''}`}
              >
                <td className="border p-2">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                <td className="border p-2">{item.invoice}</td>
                <td className="border p-2">{item.customer.id}</td>
                <td className="border p-2">{item.customer.name}</td>
                <td className="border p-2">{item.orderId}</td>
                <td className="border p-2">{item.city}, {item.pincode}</td>
                <td className="border p-2">{new Date(item.orderDate).toLocaleDateString()}</td>
                <td className="border p-2">
                  {item.status === 'Delivered'
                    ? new Date(item.deliveryDate).toLocaleDateString()
                    : 'In Transit'}
                </td>
                <td className="border p-2">{item.paymentMode}</td>
                <td className="border p-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[item.status]}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="11" className="text-center py-6 text-gray-500">
                  No matching orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center text-sm text-gray-700">
          {/* <div>
            Page {currentPage} of {totalPages}
          </div> */}
          <div>
            Page {currentPage} of {totalPages}, Total entries: {filtered.length}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => handlePageChange(-1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
