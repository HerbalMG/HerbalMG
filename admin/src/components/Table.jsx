// components/Table.jsx
const Table = ({ data }) => (
  <table className="w-full table-auto border">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-2">Customer</th>
        <th className="p-2">Orders</th>
        <th className="p-2">Total</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, idx) => (
        <tr key={idx} className="border-t">
          <td className="p-2">{row.customer}</td>
          <td className="p-2">{row.orders}</td>
          <td className="p-2">${row.total}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
