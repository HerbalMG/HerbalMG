import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', visitors: 400 },
  { name: 'Tue', visitors: 600 },
  { name: 'Wed', visitors: 200 },
  { name: 'Thu', visitors: 800 },
  { name: 'Fri', visitors: 700 },
  { name: 'Sat', visitors: 500 },
  { name: 'Sun', visitors: 900 },
];

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>
