import { useState, useMemo, useEffect } from 'react';

const statusOptions = ['Ordered', 'Shipped', 'Delivered', 'Returned', 'Refunded'];

const initialOrders = [
  {
    id: 1,
    customerName: 'John Doe',
    date: '2025-06-18',
    price: 149.99,
    status: 'Ordered',
    items: 'Aspirin x2, Thermometer x1, Bandages x5, Hand Sanitizer x1',
    address: '123 Main St, Springfield',
    notes: '',
    payment_type:'Online',
  },
  {
    id: 2,
    customerName: 'Jane Smith',
    date: '2025-06-17',
    price: 89.5,
    status: 'Shipped',
    items: 'Vitamin C x3, Bandage x5',
    address: '456 Elm St, Rivertown',
    notes: '',
    payment_type:'COD',

  },
  {
    id: 3,
    customerName: 'Robert Brown',
    date: '2025-06-15',
    price: 119.99,
    status: 'Delivered',
    items: 'Insulin Pen x1, Glucometer x1, Test Strips x50, Cotton x2, Gloves x10',
    address: '789 Oak St, Hillview',
    notes: '',
    payment_type:'UPI',
  },
  {
    id: 4,
    customerName: 'Alice Green',
    date: '2025-06-14',
    price: 59.0,
    status: 'Returned',
    items: 'Mask x5, Thermometer x1',
    address: '222 Maple Ave, Hilltown',
    notes: '',
    payment_type:'COD',

  },
];

export default function OrdersPro() {
  // === States ===
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilterStatus] = useState('All');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [showDetailsOrder, setShowDetailsOrder] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    srNo: true,
    customerName: true,
    date: true,
    price: true,
    status: true,
    items: true,
    address: true,
    notes: true,
  });
  const [noteEdits, setNoteEdits] = useState({});

  // === Sorting ===
  const handleSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // === Filtering, Searching & Sorting ===
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    if (filterStatus !== 'All') filtered = filtered.filter(o => o.status === filterStatus);

    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(o =>
        o.customerName.toLowerCase().includes(lowerTerm) ||
        o.items.toLowerCase().includes(lowerTerm) ||
        o.date.toLowerCase().includes(lowerTerm)
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === 'price') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        // String comparison
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [orders, filterStatus, searchTerm, sortConfig]);

  // === Pagination ===
  const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // === Select/Deselect rows ===
  const toggleSelectRow = id => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
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

  // === Item expansion toggle ===
  const toggleItemExpansion = id => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // === Status change handlers ===
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

  // === Bulk Delete handlers ===
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

  // === Individual Status change ===
  const handleStatusChange = (id, newStatus) => {
    setOrders(prev =>
      prev.map(order => (order.id === id ? { ...order, status: newStatus } : order))
    );
  };

  // === Note editing ===
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

  // === CSV Export ===
  const exportToCSV = () => {
    // Export selected or filtered orders
    const exportOrders = selectedIds.length ? orders.filter(o => selectedIds.includes(o.id)) : filteredOrders;

    const header = ['ID', 'Customer Name', 'Date', 'Price', 'Status', 'Items', 'Address', 'Notes'];
    const rows = exportOrders.map(o => [
      o.id,
      `"${o.customerName}"`,
      o.date,
      o.price.toFixed(2),
      o.status,
      `"${o.items}"`,
      `"${o.address}"`,
      `"${o.notes}"`,
    ]);

    const csvContent =
      [header, ...rows].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_export_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // === Column toggle ===
  const toggleColumn = col => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  // Reset page if filtered or search changes
  useEffect(() => setCurrentPage(1), [filterStatus, searchTerm, entriesPerPage]);

  return (
    <div className="p-6 max-w-full">
      <h1 className="text-3xl font-bold mb-6">Orders Dashboard</h1>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
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
          Entries per page:
          <input
            type="number"
            min={1}
            max={100}
            className="w-16 border rounded px-2 py-1"
            value={entriesPerPage}
            onChange={e => setEntriesPerPage(Number(e.target.value))}
          />
        </label>

        <button
          disabled={selectedIds.length === 0}
          onClick={() => confirmBulkDelete()}
          className="bg-red-600 disabled:bg-red-300 text-white px-4 py-1 rounded hover:bg-red-700 transition"
          title="Delete Selected"
        >
          Delete Selected
        </button>

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
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
          title="Export to CSV"
        >
          Export CSV
        </button>
      </div>

      {/* Column visibility toggles */}
      <div className="mb-4 flex flex-wrap gap-3">
        {Object.keys(visibleColumns).map(col => (
          <label key={col} className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={visibleColumns[col]}
              onChange={() => toggleColumn(col)}
            />
            {col
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())}
          </label>
        ))}
      </div>

      {/* Table container with sticky header */}
      <div className="overflow-x-auto max-w-full border rounded">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border px-3 py-2">
                <input
                  type="checkbox"
                  checked={
                    paginatedOrders.length > 0 &&
                    paginatedOrders.every(order => selectedIds.includes(order.id))
                  }
                  onChange={toggleSelectAll}
                />
              </th>

              {visibleColumns.srNo && <th className="border px-3 py-2">Sr No.</th>}

              {visibleColumns.customerName && (
                <th
                  className="border px-3 py-2 cursor-pointer select-none"
                  onClick={() => handleSort('customerName')}
                >
                  Customer Name{' '}
                  {sortConfig.key === 'customerName' ? (
                    sortConfig.direction === 'asc' ? '▲' : '▼'
                  ) : (
                    ''
                  )}
                </th>
              )}

              {visibleColumns.date && (
                <th
                  className="border px-3 py-2 cursor-pointer select-none"
                  onClick={() => handleSort('date')}
                >
                  Date{' '}
                  {sortConfig.key === 'date' ? (
                    sortConfig.direction === 'asc' ? '▲' : '▼'
                  ) : (
                    ''
                  )}
                </th>
              )}

              {visibleColumns.price && (
                <th
                  className="border px-3 py-2 cursor-pointer select-none"
                  onClick={() => handleSort('price')}
                >
                  Price{' '}
                  {sortConfig.key === 'price' ? (
                    sortConfig.direction === 'asc' ? '▲' : '▼'
                  ) : (
                    ''
                  )}
                </th>
              )}

              {visibleColumns.status && <th className="border px-3 py-2">Status</th>}

              {visibleColumns.items && <th className="border px-3 py-2">Items</th>}

              {visibleColumns.address && <th className="border px-3 py-2">Address</th>}

              {visibleColumns.payment_type && <th className="border px-3 py-2">Payment Type</th>}
              
              {visibleColumns.notes && <th className="border px-3 py-2">Notes</th>}

              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 && (
              <tr>
                <td colSpan="100%" className="text-center py-6 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
            {paginatedOrders.map((order, idx) => {
              const isSelected = selectedIds.includes(order.id);
              const isExpanded = expandedItems[order.id];
              const itemsArray = order.items.split(',').map(i => i.trim());
              const shortItems = itemsArray.slice(0, 3).join(', ');
              return (
                <tr
                  key={order.id}
                  className={isSelected ? 'bg-blue-100' : undefined}
                >
                  <td className="border px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectRow(order.id)}
                    />
                  </td>

                  {visibleColumns.srNo && (
                    <td className="border px-3 py-2 text-center">
                      {(currentPage - 1) * entriesPerPage + idx + 1}
                    </td>
                  )}

                  {visibleColumns.customerName && (
                    <td className="border px-3 py-2">{order.customerName}</td>
                  )}

                  {visibleColumns.date && (
                    <td className="border px-3 py-2">{order.date}</td>
                  )}

                  {visibleColumns.price && (
                    <td className="border px-3 py-2">${order.price.toFixed(2)}</td>
                  )}

                  {visibleColumns.status && (
                    <td className="border px-3 py-2">
                      <select
                        className="border rounded px-2 py-1 w-full"
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}

                  {visibleColumns.items && (
                    <td className="border px-3 py-2 max-w-xs">
                      {isExpanded ? (
                        <>
                          {order.items}
                          <button
                            className="ml-2 text-blue-600 underline text-xs"
                            onClick={() => toggleItemExpansion(order.id)}
                          >
                            (less)
                          </button>
                        </>
                      ) : (
                        <>
                          {shortItems}
                          {itemsArray.length > 3 && (
                            <button
                              className="ml-2 text-blue-600 underline text-xs"
                              onClick={() => toggleItemExpansion(order.id)}
                            >
                              (more)
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  )}

                  {visibleColumns.address && (
                    <td className="border px-3 py-2">{order.address}</td>
                  )}

                  {visibleColumns.payment_type && (
                    <td className="border px-3 py-2">{order.payment_type}</td>
                  )}

                  {visibleColumns.notes && (
                    <td className="border px-3 py-2 max-w-xs">
                      <textarea
                        rows={2}
                        className="w-full border rounded px-2 py-1 text-sm resize-none"
                        value={noteEdits[order.id] !== undefined ? noteEdits[order.id] : order.notes}
                        onChange={e => handleNoteChange(order.id, e.target.value)}
                        onBlur={() => saveNote(order.id)}
                        placeholder="Add notes..."
                      />
                    </td>
                  )}

                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => setShowDetailsOrder(order)}
                      className="text-blue-600 underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center flex-wrap gap-3">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          className="px-4 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          className="px-4 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Order Details Modal */}
      {showDetailsOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative max-h-full overflow-y-auto">
            <button
              onClick={() => setShowDetailsOrder(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-2xl font-bold"
              aria-label="Close details modal"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <p>
              <strong>Customer:</strong> {showDetailsOrder.customerName}
            </p>
            <p>
              <strong>Date:</strong> {showDetailsOrder.date}
            </p>
            <p>
              <strong>Price:</strong> ${showDetailsOrder.price.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {showDetailsOrder.status}
            </p>
            <p>
              <strong>Items:</strong> {showDetailsOrder.items}
            </p>
            <p>
              <strong>Address:</strong> {showDetailsOrder.address}
            </p>
            <p>
              <strong>Notes:</strong> {showDetailsOrder.notes || '(No notes)'}
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              {pendingDelete ? 'Confirm Deletion' : 'Confirm Status Change'}
            </h2>
            <p>
              {pendingDelete
                ? `Are you sure you want to delete ${selectedIds.length} selected order(s)? This action cannot be undone.`
                : `Are you sure you want to change the status of ${selectedIds.length} selected order(s) to "${pendingStatusChange}"?`}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingStatusChange(null);
                  setPendingDelete(false);
                }}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded text-white ${
                  pendingDelete ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                onClick={() => {
                  if (pendingDelete) applyBulkDelete();
                  else applyBulkStatusChange();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
