// components/Chart.jsx
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', sales: 400 },
  { name: 'Feb', sales: 300 },
  { name: 'Mar', sales: 500 },
];

const Chart = () => (
  <LineChart width={600} height={300} data={data}>
    <Line type="monotone" dataKey="sales" stroke="#3b82f6" />
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
  </LineChart>
);

export default Chart;
