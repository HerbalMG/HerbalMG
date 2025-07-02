import { useState, useMemo, useEffect } from 'react';

const statusOptions = ['Ordered', 'Shipped', 'Delivered', 'Returned', 'Refunded'];

const initialOrders = [
  {
    id: 1,
    invoiceId: 'INV-1001',
    customerName: 'John Doe',
    date: '2025-06-18',
    price: 149.99,
    status: 'Shipped',
    items: 'Aspirin x2, Thermometer x1, Bandages x5, Hand Sanitizer x1',
    address: '123 Main St, Springfield',
    notes: '',
    payment_type: 'Online',
  },
  {
    id: 2,
    invoiceId: 'INV-1002',
    customerName: 'Jane Smith',
    date: '2025-06-17',
    price: 89.5,
    status: 'Shipped',
    items: 'Vitamin C x3, Bandage x5',
    address: '456 Elm St, Rivertown',
    notes: '',
    payment_type: 'COD',
    prescriptionRequired: true,
  },
  {
    id: 3,
    invoiceId: 'INV-1003',
    customerName: 'Robert Brown',
    date: '2025-06-15',
    price: 119.99,
    status: 'Delivered',
    items: 'Insulin Pen x1, Glucometer x1, Test Strips x50, Cotton x2, Gloves x10',
    address: '789 Oak St, Hillview',
    notes: '',
    payment_type: 'UPI',
  },
  {
    id: 4,
    invoiceId: 'INV-1004',
    customerName: 'Alice Green',
    date: '2025-06-14',
    price: 59.0,
    status: 'Returned',
    items: 'Mask x5, Thermometer x1',
    address: '222 Maple Ave, Hilltown',
    notes: '',
    payment_type: 'COD',
  },
];

export default function OrdersPro() {
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilterStatus] = useState('All');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [showDetailsOrder, setShowDetailsOrder] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [noteEdits, setNoteEdits] = useState({});
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    srNo: true,
    orderId: true,
    invoiceId: true,
    customerName: true,
    date: true,
    price: true,
    status: true,
    items: true,
    address: true,
    payment_type: true,
    notes: true,
  });

  // Sorting
  const handleSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // Filtering, Searching, Sorting
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    if (filterStatus !== 'All') filtered = filtered.filter(o => o.status === filterStatus);
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(o =>
        o.customerName.toLowerCase().includes(lower) ||
        o.items.toLowerCase().includes(lower) ||
        o.date.toLowerCase().includes(lower)
      );
    }
    if (dateFrom) {
      filtered = filtered.filter(o => new Date(o.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(o => new Date(o.date) <= new Date(dateTo));
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === 'price') return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        if (sortConfig.key === 'date') {
          const dateA = new Date(aVal);
          const dateB = new Date(bVal);
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        aVal = aVal?.toString().toLowerCase();
        bVal = bVal?.toString().toLowerCase();
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }

    return filtered;
  }, [orders, filterStatus, searchTerm, sortConfig, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Toggle Select
  const toggleSelectRow = id => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const pageIds = paginatedOrders.map(o => o.id);
    const allSelected = pageIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...pageIds])]);
    }
  };

  // Status changes
  const confirmBulkStatusChange = status => {
    setPendingStatusChange(status);
    setShowConfirmModal(true);
  };

  const applyBulkStatusChange = () => {
    setOrders(prev =>
      prev.map(order =>
        selectedIds.includes(order.id) ? { ...order, status: pendingStatusChange } : order
      )
    );
    setSelectedIds([]);
    setShowConfirmModal(false);
    setPendingStatusChange(null);
  };

  const confirmBulkDelete = () => {
    setPendingDelete(true);
    setShowConfirmModal(true);
  };

  const applyBulkDelete = () => {
    setOrders(prev => prev.filter(order => !selectedIds.includes(order.id)));
    setSelectedIds([]);
    setShowConfirmModal(false);
    setPendingDelete(false);
  };

  const handleStatusChange = (id, newStatus) => {
    setOrders(prev =>
      prev.map(order => order.id === id ? { ...order, status: newStatus } : order)
    );
  };

  const handleNoteChange = (id, text) => {
    setNoteEdits(prev => ({ ...prev, [id]: text }));
  };

  const saveNote = id => {
    const newNote = noteEdits[id] || '';
    setOrders(prev =>
      prev.map(order => (order.id === id ? { ...order, notes: newNote } : order))
    );
    setNoteEdits(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const toggleItemExpansion = id => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleColumn = col => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  useEffect(() => setCurrentPage(1), [filterStatus, searchTerm, entriesPerPage, dateFrom, dateTo]);

  const fetchOrders = () => {
    return initialOrders;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newOrders = fetchOrders(); // Simulated fetch
      setOrders(newOrders);
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="search"
          placeholder="Search customer, items, date..."
          className="border rounded px-3 py-1 w-64"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <label className="flex items-center gap-2">
          Status:
          <select
            className="border rounded px-2 py-1"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option>All</option>
            {statusOptions.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          From:
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2">
          To:
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
          />
        </label>

        <label className="flex items-center gap-2">
          Bulk Status:
          <select
            className="border rounded px-2 py-1"
            onChange={e => confirmBulkStatusChange(e.target.value)}
            defaultValue=""
            disabled={selectedIds.length === 0}
          >
            <option value="" disabled>
              Change to...
            </option>
            {statusOptions.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>

        <button
          disabled={selectedIds.length === 0}
          onClick={confirmBulkDelete}
          className="bg-red-600 disabled:bg-red-300 text-white px-4 py-1 rounded hover:bg-red-700"
        >
          Delete Selected
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-[1500px] w-full text-sm border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border px-2 py-2 text-center">
                <input
                  type="checkbox"
                  checked={paginatedOrders.every(o => selectedIds.includes(o.id))}
                  onChange={toggleSelectAll}
                />
              </th>
              {visibleColumns.srNo && <th className="border px-2 py-2">Sr No</th>}
              {visibleColumns.orderId && <th className="border px-2 py-2">Order ID</th>}
              {visibleColumns.invoiceId && <th className="border px-2 py-2">Invoice ID</th>}
              {visibleColumns.customerName && <th className="border px-2 py-2">Customer</th>}
              {visibleColumns.date && (
  <th
    className="border px-3 py-2 cursor-pointer select-none whitespace-nowrap min-w-[120px]"
    onClick={() => handleSort('date')}
  >
    Date{' '}
    {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
  </th>
)}
              {visibleColumns.price && <th className="border px-2 py-2">Price (₹)</th>}
              {visibleColumns.status && <th className="border px-2 py-2">Status</th>}
              {visibleColumns.items && <th className="border px-2 py-2">Items</th>}
              {visibleColumns.address && <th className="border px-2 py-2">Address</th>}
              {visibleColumns.payment_type && <th className="border px-2 py-2">Payment</th>}
              {visibleColumns.notes && <th className="border px-2 py-2">Notes</th>}
              <th className="border px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order, idx) => (
              <tr
  key={order.id}
  className={order.prescriptionRequired ? 'border-2 border-red-500' : ''}
>

                <td className="border text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(order.id)}
                    onChange={() => toggleSelectRow(order.id)}
                  />
                </td>
                {visibleColumns.srNo && <td className="border px-2 py-1 text-center">{(currentPage - 1) * entriesPerPage + idx + 1}</td>}
                {visibleColumns.orderId && <td className="border px-2 py-1">{order.id}</td>}
                {visibleColumns.invoiceId && <td className="border px-2 py-1">{order.invoiceId}</td>}
                {visibleColumns.customerName && <td className="border px-2 py-1">{order.customerName}</td>}
                {visibleColumns.date && (
  <td className="border px-3 py-2 whitespace-nowrap min-w-[120px]">
    {order.date}
  </td>
)}
                {visibleColumns.price && <td className="border px-2 py-1">₹{order.price.toFixed(2)}</td>}
                {visibleColumns.status && (
                  <td className="border px-2 py-1">
                    <select
                      className="border rounded px-1 py-0.5"
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                    >
                      {statusOptions.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                )}
                {visibleColumns.items && (
                  <td className="border px-2 py-1">{order.items}</td>
                )}
                {visibleColumns.address && <td className="border px-2 py-1">{order.address}</td>}
                {visibleColumns.payment_type && <td className="border px-2 py-1">{order.payment_type}</td>}
                {visibleColumns.notes && (
                  <td className="border px-2 py-1">
                    <textarea
                      rows={2}
                      value={noteEdits[order.id] ?? order.notes}
                      onChange={e => handleNoteChange(order.id, e.target.value)}
                      onBlur={() => saveNote(order.id)}
                      className="w-full border rounded"
                      placeholder="Note..."
                    />
                  </td>
                )}
                <td className="border px-2 py-1 text-center">
                  <button
                    className="text-blue-600 underline"
                    onClick={() => setShowDetailsOrder(order)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <label>
            Entries per page:
            <select
              value={entriesPerPage}
              onChange={e => setEntriesPerPage(Number(e.target.value))}
              className="ml-2 border px-2 py-1"
            >
              {[10, 25, 50].map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="border px-3 py-1 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages} | Total entries: {filteredOrders.length}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="border px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* View Modal */}
{showDetailsOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg max-h-full overflow-auto relative">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-xl"
        onClick={() => setShowDetailsOrder(null)}
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>

      <div className="space-y-2 text-sm">
        <p><strong>Order ID:</strong> {showDetailsOrder.id}</p>
        <p><strong>Invoice ID:</strong> {showDetailsOrder.invoiceId}</p>
        <p><strong>Customer:</strong> {showDetailsOrder.customerName}</p>
        <p><strong>Date:</strong> {showDetailsOrder.date}</p>
        <p><strong>Price:</strong> ₹{showDetailsOrder.price.toFixed(2)}</p>
        <p><strong>Status:</strong> {showDetailsOrder.status}</p>
        <p><strong>Items:</strong> {showDetailsOrder.items}</p>
        <p><strong>Address:</strong> {showDetailsOrder.address}</p>
        <p><strong>Payment Type:</strong> {showDetailsOrder.payment_type}</p>
        <p><strong>Notes:</strong> {showDetailsOrder.notes || '(No notes)'}</p>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
