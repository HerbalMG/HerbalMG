import React, { useState, useEffect, useMemo, useRef } from 'react';

// Simulate API data fetch (add more data as needed)
const initialCustomers = [
  {
    id: 1,
    name: 'John Doe',
    mobile: '9876543210',
    order: 'Paracetamol 500mg',
    status: 'Delivered',
    email: 'john@example.com',
    address: '123 Main St, Springfield',
    orderDate: '2025-06-15',
    active: true,
  },
  {
    id: 2,
    name: 'Jane Smith',
    mobile: '9123456789',
    order: 'Vitamin C Tablets',
    status: 'Pending',
    email: 'jane@example.com',
    address: '456 Elm St, Springfield',
    orderDate: '2025-06-17',
    active: true,
  },
  {
    id: 3,
    name: 'Mike Johnson',
    mobile: '9988776655',
    order: 'Blood Pressure Monitor',
    status: 'Shipped',
    email: 'mike@example.com',
    address: '789 Oak St, Springfield',
    orderDate: '2025-06-14',
    active: true,
  },
  {
    id: 4,
    name: 'Lisa Ray',
    mobile: '9456123789',
    order: 'Cough Syrup',
    status: 'Delivered',
    email: 'lisa@example.com',
    address: '101 Pine St, Springfield',
    orderDate: '2025-06-12',
    active: true,
  },
  {
    id: 5,
    name: 'Paul Walker',
    mobile: '9345612789',
    order: 'Antibiotics',
    status: 'Pending',
    email: 'paul@example.com',
    address: '202 Maple St, Springfield',
    orderDate: '2025-06-18',
    active: true,
  },
  // add more if needed
];

const statusColors = {
  Delivered: 'text-green-600',
  Pending: 'text-yellow-600',
  Shipped: 'text-blue-600',
  Deactivated: 'text-gray-400 line-through',
};

const allStatuses = ['Delivered', 'Pending', 'Shipped'];

export default function CustomerDetails() {
  // States
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(new Set(allStatuses)); // multi status
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'orderDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal states
  const [modalCustomer, setModalCustomer] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view' | 'edit' | 'deactivate' | 'delete'

  // For accessibility focus management on modal close
  const lastFocusedElement = useRef(null);

  // Simulate fetching data (loading & error handling)
  useEffect(() => {
    setLoading(true);
    setError(null);
    const timeout = setTimeout(() => {
      // Simulate 10% chance of error
      if (Math.random() < 0.1) {
        setError('Failed to fetch customer data. Please try again.');
        setLoading(false);
      } else {
        setCustomers(initialCustomers);
        setLoading(false);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Accessibility: trap focus inside modal
  useEffect(() => {
    if (modalCustomer) {
      lastFocusedElement.current = document.activeElement;
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      function trapFocus(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstEl) {
              e.preventDefault();
              lastEl.focus();
            }
          } else {
            if (document.activeElement === lastEl) {
              e.preventDefault();
              firstEl.focus();
            }
          }
        }
        if (e.key === 'Escape') {
          closeModal();
        }
      }
      document.addEventListener('keydown', trapFocus);
      firstEl?.focus();

      return () => {
        document.removeEventListener('keydown', trapFocus);
        lastFocusedElement.current?.focus();
      };
    }
  }, [modalCustomer]);

  // Toggle status filter
  function toggleStatus(status) {
    const newSet = new Set(statusFilter);
    if (newSet.has(status)) {
      newSet.delete(status);
    } else {
      newSet.add(status);
    }
    if (newSet.size === 0) {
      // Prevent empty set = no filters, revert to all
      setStatusFilter(new Set(allStatuses));
    } else {
      setStatusFilter(newSet);
    }
    setCurrentPage(1);
  }

  // Sort handler
  function requestSort(key) {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }

  // Close modal helper
  function closeModal() {
    setModalCustomer(null);
    setModalMode(null);
  }

  // Save edited customer
  function saveCustomer(edited) {
    setCustomers(prev =>
      prev.map(c => (c.id === edited.id ? { ...c, ...edited } : c))
    );
    closeModal();
  }

  // Deactivate customer (mark inactive)
  function deactivateCustomer(id) {
    setCustomers(prev =>
      prev.map(c => (c.id === id ? { ...c, active: false } : c))
    );
    closeModal();
  }

  // Delete customer permanently
  function deleteCustomer(id) {
    setCustomers(prev => prev.filter(c => c.id !== id));
    closeModal();
  }

  // Filtered and sorted customers
  const filtered = useMemo(() => {
    return customers
      .filter(cust => {
        if (!cust.active) return false; // Hide deactivated in main list
        // status filter
        if (!statusFilter.has(cust.status)) return false;
        // search
        const searchLower = search.toLowerCase();
        if (
          !cust.name.toLowerCase().includes(searchLower) &&
          !cust.mobile.includes(search) &&
          !cust.email.toLowerCase().includes(searchLower)
        )
          return false;
        // date range filter
        if (dateFrom && cust.orderDate < dateFrom) return false;
        if (dateTo && cust.orderDate > dateTo) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortConfig.key === 'orderDate') {
          const dateA = new Date(a.orderDate);
          const dateB = new Date(b.orderDate);
          return sortConfig.direction === 'asc'
            ? dateA - dateB
            : dateB - dateA;
        }
        if (sortConfig.key === 'status') {
          const comp = a.status.localeCompare(b.status);
          return sortConfig.direction === 'asc' ? comp : -comp;
        }
        return 0;
      });
  }, [customers, search, statusFilter, dateFrom, dateTo, sortConfig]);

  // Pagination calculation
  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle changing itemsPerPage input
  function onItemsPerPageChange(e) {
    let val = Number(e.target.value);
    if (isNaN(val) || val <= 0) val = 5;
    setItemsPerPage(val);
    setCurrentPage(1);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Customer Details</h1>

      {/* Error and loading */}
      {error && (
        <div
          role="alert"
          className="mb-4 p-4 bg-red-100 text-red-700 rounded-md"
          tabIndex={-1}
        >
          {error}{' '}
          <button
            className="underline"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      {loading && (
        <div role="status" aria-live="polite" className="mb-4">
          Loading customers...
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6 items-center">
            {/* Search */}
            <label htmlFor="search" className="sr-only">
              Search customers
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name, mobile or email"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 flex-grow max-w-sm"
              aria-describedby="search-desc"
            />
            <span id="search-desc" className="sr-only">
              Type to search customer by name, mobile number or email.
            </span>

            {/* Status Multi-Select Filter */}
            <fieldset className="flex gap-2 items-center">
              <legend className="sr-only">Filter by status</legend>
              {allStatuses.map(status => (
                <label
                  key={status}
                  className="inline-flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={statusFilter.has(status)}
                    onChange={() => toggleStatus(status)}
                    className="form-checkbox"
                  />
                  <span className="ml-1">{status}</span>
                </label>
              ))}
            </fieldset>

            {/* Date range */}
            <label htmlFor="dateFrom" className="flex flex-col text-sm">
              From:
              <input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={e => {
                  setDateFrom(e.target.value);
                  setCurrentPage(1);
                }}
                className="border rounded-md px-2 py-1"
              />
            </label>
            <label htmlFor="dateTo" className="flex flex-col text-sm">
              To:
              <input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={e => {
                  setDateTo(e.target.value);
                  setCurrentPage(1);
                }}
                className="border rounded-md px-2 py-1"
              />
            </label>

            {/* Items per page */}
            <label htmlFor="itemsPerPage" className="flex flex-col text-sm max-w-[100px]">
              Items per page:
              <input
                id="itemsPerPage"
                type="number"
                min="1"
                value={itemsPerPage}
                onChange={onItemsPerPageChange}
                className="border rounded-md px-2 py-1"
              />
            </label>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow rounded-md" role="table" aria-label="Customer details table">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b">Sr. No</th>
                  <th className="px-4 py-2 border-b cursor-pointer" onClick={() => requestSort('name')}>
                    Name
                    {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th className="px-4 py-2 border-b">Mobile Number</th>
                  <th className="px-4 py-2 border-b">Order</th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => requestSort('status')}
                    aria-sort={
                      sortConfig.key === 'status'
                        ? sortConfig.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    Status {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => requestSort('orderDate')}
                    aria-sort={
                      sortConfig.key === 'orderDate'
                        ? sortConfig.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    Order Date {sortConfig.key === 'orderDate' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((cust, idx) => (
                    <tr
                      key={cust.id}
                      className="hover:bg-gray-50"
                      tabIndex={0}
                      aria-label={`Customer ${cust.name}, status ${cust.status}, order date ${cust.orderDate}`}
                    >
                      <td className="px-4 py-2 border-b">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td className="px-4 py-2 border-b">{cust.name}</td>
                      <td className="px-4 py-2 border-b">{cust.mobile}</td>
                      <td className="px-4 py-2 border-b">{cust.order}</td>
                      <td className={`px-4 py-2 border-b font-medium ${statusColors[cust.status]}`}>
                        {cust.status}
                      </td>
                      <td className="px-4 py-2 border-b">{cust.orderDate}</td>
                      <td className="px-4 py-2 border-b flex gap-2">
                        <button
                          className="text-indigo-600 hover:underline"
                          onClick={() => {
                            setModalCustomer(cust);
                            setModalMode('view');
                          }}
                          aria-label={`View details of ${cust.name}`}
                        >
                          View
                        </button>
                        <button
                          className="text-yellow-600 hover:underline"
                          onClick={() => {
                            setModalCustomer(cust);
                            setModalMode('edit');
                          }}
                          aria-label={`Edit details of ${cust.name}`}
                        >
                          Edit
                        </button>
                        <button
                          className="text-gray-600 hover:underline"
                          onClick={() => {
                            setModalCustomer(cust);
                            setModalMode('deactivate');
                          }}
                          aria-label={`Deactivate ${cust.name}`}
                        >
                          Deactivate
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => {
                            setModalCustomer(cust);
                            setModalMode('delete');
                          }}
                          aria-label={`Delete ${cust.name}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav
            className="flex justify-center items-center gap-2 mt-4"
            aria-label="Pagination Navigation"
          >
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
              aria-disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(pageCount)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? 'bg-indigo-600 text-white' : ''
                }`}
                aria-current={currentPage === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount}
              className="px-3 py-1 border rounded disabled:opacity-50"
              aria-disabled={currentPage === pageCount}
            >
              Next
            </button>
          </nav>

          {/* Modals */}
          {modalCustomer && modalMode === 'view' && (
            <Modal onClose={closeModal} title={`Details of ${modalCustomer.name}`}>
              <DetailsView customer={modalCustomer} />
            </Modal>
          )}

          {modalCustomer && modalMode === 'edit' && (
            <Modal onClose={closeModal} title={`Edit ${modalCustomer.name}`}>
              <EditForm customer={modalCustomer} onSave={saveCustomer} onCancel={closeModal} />
            </Modal>
          )}

          {modalCustomer && modalMode === 'deactivate' && (
            <Modal onClose={closeModal} title={`Deactivate ${modalCustomer.name}`}>
              <ConfirmAction
                message={`Are you sure you want to deactivate ${modalCustomer.name}?`}
                onConfirm={() => deactivateCustomer(modalCustomer.id)}
                onCancel={closeModal}
              />
            </Modal>
          )}

          {modalCustomer && modalMode === 'delete' && (
            <Modal onClose={closeModal} title={`Delete ${modalCustomer.name}`}>
              <ConfirmAction
                message={`Are you sure you want to permanently delete ${modalCustomer.name}? This action cannot be undone.`}
                onConfirm={() => deleteCustomer(modalCustomer.id)}
                onCancel={closeModal}
                destructive
              />
            </Modal>
          )}
        </>
      )}
    </div>
  );
}

// Modal wrapper
function Modal({ children, onClose, title }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-md max-w-lg w-full p-6 shadow-lg relative">
        <h2
          id="modal-title"
          className="text-xl font-semibold mb-4 text-gray-800"
          tabIndex={0}
        >
          {title}
        </h2>
        <button
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

// Details view modal content
function DetailsView({ customer }) {
  return (
    <div className="space-y-2 text-gray-700">
      <p><strong>Name:</strong> {customer.name}</p>
      <p><strong>Mobile:</strong> {customer.mobile}</p>
      <p><strong>Email:</strong> {customer.email}</p>
      <p><strong>Address:</strong> {customer.address}</p>
      <p><strong>Order:</strong> {customer.order}</p>
      <p><strong>Status:</strong> {customer.status}</p>
      <p><strong>Order Date:</strong> {customer.orderDate}</p>
      <p><strong>Active:</strong> {customer.active ? 'Yes' : 'No'}</p>
    </div>
  );
}

// Edit form modal content
function EditForm({ customer, onSave, onCancel }) {
  const [formData, setFormData] = useState({ ...customer });

  // Validate inputs - basic example
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required.';
    if (!formData.mobile.match(/^\d{10}$/)) errs.mobile = 'Mobile must be 10 digits.';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Invalid email.';
    if (!formData.order.trim()) errs.order = 'Order cannot be empty.';
    if (!formData.status || !allStatuses.includes(formData.status))
      errs.status = 'Status is invalid.';
    if (!formData.orderDate) errs.orderDate = 'Order date is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
      <div>
        <label htmlFor="name" className="block font-semibold mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1" id="name-error">
            {errors.name}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="mobile" className="block font-semibold mb-1">
          Mobile Number
        </label>
        <input
          id="mobile"
          type="text"
          value={formData.mobile}
          onChange={e => setFormData({ ...formData, mobile: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          aria-invalid={!!errors.mobile}
          aria-describedby={errors.mobile ? 'mobile-error' : undefined}
        />
        {errors.mobile && (
          <p className="text-red-600 text-sm mt-1" id="mobile-error">
            {errors.mobile}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="email" className="block font-semibold mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1" id="email-error">
            {errors.email}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="address" className="block font-semibold mb-1">
          Address
        </label>
        <textarea
          id="address"
          value={formData.address}
          onChange={e => setFormData({ ...formData, address: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="order" className="block font-semibold mb-1">
          Order
        </label>
        <input
          id="order"
          type="text"
          value={formData.order}
          onChange={e => setFormData({ ...formData, order: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          aria-invalid={!!errors.order}
          aria-describedby={errors.order ? 'order-error' : undefined}
        />
        {errors.order && (
          <p className="text-red-600 text-sm mt-1" id="order-error">
            {errors.order}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="status" className="block font-semibold mb-1">
          Status
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={e => setFormData({ ...formData, status: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          aria-invalid={!!errors.status}
          aria-describedby={errors.status ? 'status-error' : undefined}
        >
          {allStatuses.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="text-red-600 text-sm mt-1" id="status-error">
            {errors.status}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="orderDate" className="block font-semibold mb-1">
          Order Date
        </label>
        <input
          id="orderDate"
          type="date"
          value={formData.orderDate}
          onChange={e => setFormData({ ...formData, orderDate: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          aria-invalid={!!errors.orderDate}
          aria-describedby={errors.orderDate ? 'orderDate-error' : undefined}
        />
        {errors.orderDate && (
          <p className="text-red-600 text-sm mt-1" id="orderDate-error">
            {errors.orderDate}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}

// Confirmation modal content
function ConfirmAction({ message, onConfirm, onCancel, destructive = false }) {
  return (
    <div className="text-gray-700">
      <p className="mb-4">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 rounded ${
            destructive
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-yellow-500 text-white hover:bg-yellow-600'
          }`}
          autoFocus
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
