import React, { useState, useEffect, useMemo } from 'react';

// Sample customer data (replace with real data or API)
const initialCustomers = [
  {
    id: 'CUST001',
    name: 'Alice Johnson',
    mobile: '1234567890',
    email: 'alice@example.com',
    address: '1234 Elm Street, Springfield, IL 62704',
    active: true,
  },
  {
    id: 'CUST002',
    name: 'Bob Smith',
    mobile: '9876543210',
    email: 'bob@example.com',
    address: '5678 Oak Avenue, Metropolis, NY 10001',
    active: true,
  },
  // Add more customers as needed
];

export default function CustomerDetails() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [modal, setModal] = useState({ type: null, customer: null });

  useEffect(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setCustomers(initialCustomers);
      setLoading(false);
    }, 500);
  }, []);

  const closeModal = () => setModal({ type: null, customer: null });

  const deactivateCustomer = id => {
    setCustomers(custs =>
      custs.map(c => (c.id === id ? { ...c, active: false } : c))
    );
    closeModal();
  };

  const deleteCustomer = id => {
    setCustomers(custs => custs.filter(c => c.id !== id));
    closeModal();
  };

  const filtered = useMemo(() => {
    return customers
      .filter(c => c.active)
      .filter(c => {
        const s = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(s) ||
          c.id.toLowerCase().includes(s) ||
          c.mobile.includes(search) ||
          c.email.toLowerCase().includes(s)
        );
      });
  }, [customers, search]);

  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Details</h1>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              className="border px-3 py-2"
              placeholder="Name / ID / mobile / email"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <label>
              Items per page:
              <input
                type="number"
                min="1"
                value={itemsPerPage}
                className="border px-2 ml-2 w-16"
                onChange={e => {
                  const v = Number(e.target.value) || 5;
                  setItemsPerPage(v);
                  setCurrentPage(1);
                }}
              />
            </label>
          </div>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1 border">Sr.no</th>
                <th className="px-2 py-1 border">Name</th>
                <th className="px-2 py-1 border">Customer ID</th>
                <th className="px-2 py-1 border">Mobile</th>
                <th className="px-2 py-1 border">Email</th>
                <th className="px-2 py-1 border">Address</th>
                <th className="px-2 py-1 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                paginated.map((c, idx) => (
                  <CustomerRow
                    key={c.id}
                    serial={(currentPage - 1) * itemsPerPage + idx + 1}
                    customer={c}
                    onDeactivate={() => setModal({ type: 'deactivate', customer: c })}
                    onDelete={() => setModal({ type: 'delete', customer: c })}
                  />
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <Pagination
              currentPage={currentPage}
              pageCount={pageCount}
              onPageChange={p => setCurrentPage(p)}
            />
            <div className="text-sm text-gray-700">
              Page {currentPage} of {pageCount}, total entries: {filtered.length}
            </div>
          </div>

          {modal.type && (
            <ConfirmModal
              title={
                modal.type === 'deactivate'
                  ? `Deactivate "${modal.customer.name}"?`
                  : `Delete "${modal.customer.name}"?`
              }
              confirmLabel={modal.type === 'deactivate' ? 'Deactivate' : 'Delete'}
              onConfirm={() =>
                modal.type === 'deactivate'
                  ? deactivateCustomer(modal.customer.id)
                  : deleteCustomer(modal.customer.id)
              }
              onCancel={closeModal}
            >
              Are you sure you want to{' '}
              {modal.type === 'deactivate' ? 'deactivate' : 'delete'} this customer?
            </ConfirmModal>
          )}
        </>
      )}
    </div>
  );
}

function CustomerRow({ serial, customer, onDeactivate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const limit = 50;

  return (
    <tr className="hover:bg-gray-50">
      <td className="p-2 border text-center">{serial}</td>
      <td className="p-2 border">{customer.name}</td>
      <td className="p-2 border">{customer.id}</td>
      <td className="p-2 border">{customer.mobile}</td>
      <td className="p-2 border">{customer.email}</td>
      <td className="p-2 border">
        {customer.address.length > limit && !expanded
          ? `${customer.address.slice(0, limit)}… `
          : customer.address}{' '}
        {customer.address.length > limit && (
          <button
            className="text-blue-600 underline"
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </td>
      <td className="p-2 border space-x-2 text-sm">
        
        <button className="text-red-600 hover:underline" onClick={onDelete}>
          Delete
        </button>
      </td>
    </tr>
  );
}

function Pagination({ currentPage, pageCount, onPageChange }) {
  return (
    <div className="flex space-x-2">
      {/* <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        className="px-2 py-1 border disabled:opacity-50"
      >
        « First
      </button> */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2 py-1 border disabled:opacity-50"
      >
        ‹ Prev
      </button>
      <span className="px-2 py-1 border">
        {currentPage}
      </span>
      <button
        disabled={currentPage === pageCount}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2 py-1 border disabled:opacity-50"
      >
        Next ›
      </button>
      {/* <button
        disabled={currentPage === pageCount}
        onClick={() => onPageChange(pageCount)}
        className="px-2 py-1 border disabled:opacity-50"
      >
        Last »
      </button> */}
    </div>
  );
}

function ConfirmModal({ title, children, confirmLabel, onConfirm, onCancel }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded ${
              confirmLabel === 'Delete'
                ? 'bg-red-600 text-white'
                : 'bg-yellow-500 text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
