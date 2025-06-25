import React, { useState } from 'react';

const PaymentTable = () => {
  const paymentsData = [
    { invoiceNumber: 'INV-10293', date: '2025-06-20', amount: 249.99, method: 'Credit Card (Visa)', status: 'Paid' },
    { invoiceNumber: 'INV-10294', date: '2025-06-21', amount: 99.0, method: 'COD', status: 'Unpaid' },
    { invoiceNumber: 'INV-10295', date: '2025-06-22', amount: 199.5, method: 'Bank Transfer', status: 'Paid' },
    { invoiceNumber: 'INV-10296', date: '2025-06-23', amount: 149.0, method: 'UPI', status: 'Refunded' },
    { invoiceNumber: 'INV-10297', date: '2025-06-24', amount: 189.0, method: 'Credit Card (Visa)', status: 'Paid' },
    { invoiceNumber: 'INV-10298', date: '2025-06-25', amount: 299.0, method: 'Bank Transfer', status: 'Unpaid' },
    { invoiceNumber: 'INV-10299', date: '2025-06-26', amount: 179.0, method: 'COD', status: 'Paid' },
    { invoiceNumber: 'INV-10300', date: '2025-06-27', amount: 89.0, method: 'UPI', status: 'Refunded' },
  ];

  const [payments, setPayments] = useState(paymentsData);
  const [filters, setFilters] = useState({
    status: '',
    method: '',
    fromDate: '',
    toDate: '',
    search: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editRowData, setEditRowData] = useState({ amount: '', method: '', status: '' });

  const handleFilterChange = (e) => {
    setCurrentPage(1); // reset page on filter change
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = filters.status === '' || payment.status === filters.status;
    const matchesMethod =
      filters.method === '' || payment.method.toLowerCase().includes(filters.method.toLowerCase());
    const matchesSearch = payment.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase());

    const paymentDate = new Date(payment.date);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;

    const matchesDate = (!fromDate || paymentDate >= fromDate) && (!toDate || paymentDate <= toDate);

    return matchesStatus && matchesMethod && matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  // Edit handlers
  const startEditing = (index) => {
    const payment = paginatedPayments[index];
    setEditingIndex(index);
    setEditRowData({
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
    });
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditRowData({ amount: '', method: '', status: '' });
  };

  const saveEditing = () => {
    const globalIndex = startIndex + editingIndex;
    const updatedPayments = [...payments];
    updatedPayments[globalIndex] = {
      ...updatedPayments[globalIndex],
      amount: parseFloat(editRowData.amount),
      method: editRowData.method,
      status: editRowData.status,
    };
    setPayments(updatedPayments);
    cancelEditing();
  };

  const handleEditChange = (e) => {
    setEditRowData({ ...editRowData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 ">
      <div className="w-full max-w-7xl bg-white p-6 rounded-lg ">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment History</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <input
            type="text"
            name="search"
            placeholder="Search Invoice #"
            value={filters.search}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Refunded">Refunded</option>
          </select>
          <select
            name="method"
            value={filters.method}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Methods</option>
            <option value="Credit">Credit Card</option>
            <option value="COD">Cash on Delivery</option>
            <option value="Bank">Bank Transfer</option>
            <option value="UPI">UPI</option>
          </select>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <select
            name="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">Sr No.</th>
                <th className="py-2 px-4 border-b">Invoice #</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Payment Method</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No payments found.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment, index) => (
                  <tr key={payment.invoiceNumber} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{startIndex + index + 1}</td>
                    <td className="py-2 px-4 border-b">{payment.invoiceNumber}</td>
                    <td className="py-2 px-4 border-b">{payment.date}</td>

                    {/* Editable Amount */}
                    <td className="py-2 px-4 border-b">
                      {editingIndex === index ? (
                        <input
                          type="number"
                          step="0.01"
                          name="amount"
                          value={editRowData.amount}
                          onChange={handleEditChange}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        payment.amount.toLocaleString('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        })
                      )}
                    </td>

                    {/* Editable Method */}
                    <td className="py-2 px-4 border-b">
                      {editingIndex === index ? (
                        <select
                          name="method"
                          value={editRowData.method}
                          onChange={handleEditChange}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        >
                          <option value="Credit Card (Visa)">Credit Card (Visa)</option>
                          <option value="COD">Cash on Delivery</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="UPI">UPI</option>
                        </select>
                      ) : (
                        payment.method
                      )}
                    </td>

                    {/* Editable Status */}
                    <td className="py-2 px-4 border-b">
                      {editingIndex === index ? (
                        <select
                          name="status"
                          value={editRowData.status}
                          onChange={handleEditChange}
                          className={`font-semibold px-2 py-1 w-full rounded ${
                            editRowData.status === 'Paid'
                              ? 'text-green-600 border border-green-600'
                              : editRowData.status === 'Unpaid'
                              ? 'text-red-600 border border-red-600'
                              : 'text-yellow-600 border border-yellow-600'
                          }`}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Unpaid">Unpaid</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      ) : (
                        <span
                          className={`font-semibold ${
                            payment.status === 'Paid'
                              ? 'text-green-600'
                              : payment.status === 'Unpaid'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {payment.status}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-4 border-b space-x-2">
                      {editingIndex === index ? (
                        <>
                          <button
                            onClick={saveEditing}
                            className="text-green-600 hover:underline text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEditing(index)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Showing {filteredPayments.length === 0 ? 0 : startIndex + 1} -{' '}
            {Math.min(startIndex + itemsPerPage, filteredPayments.length)} of {filteredPayments.length}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;
