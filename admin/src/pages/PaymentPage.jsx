import React from 'react';

const PaymentTable = () => {
  const payments = [
    {
      invoiceNumber: 'INV-10293',
      date: '2025-06-20',
      amount: '249.99',
      method: 'Credit Card (Visa)',
      status: 'Paid',
    },
    {
      invoiceNumber: 'INV-10294',
      date: '2025-06-21',
      amount: '99.00',
      method: 'COD',
      status: 'Unpaid',
    },
    {
      invoiceNumber: 'INV-10295',
      date: '2025-06-22',
      amount: '199.50',
      method: 'Bank Transfer',
      status: 'Paid',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Payment History</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">Invoice #</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Payment Method</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{payment.invoiceNumber}</td>
                  <td className="py-2 px-4 border-b">{payment.date}</td>
                  <td className="py-2 px-4 border-b">{payment.amount}</td>
                  <td className="py-2 px-4 border-b">{payment.method}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`font-semibold ${payment.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button className="text-blue-600 hover:underline text-sm">
                      Download Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;
