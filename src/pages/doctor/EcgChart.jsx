import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function EcgChart({ ecgString }) {
  // Transformă stringul în array de obiecte { idx, value }
  const data = (ecgString || '')
    .split(',')
    .map((v, idx) => ({ idx, value: Number(v) }))
    .filter(d => !isNaN(d.value));

  if (!data.length) return <div>Nu există date ECG.</div>;

  return (
    <div>
      <h3>Simulare ECG</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="idx" hide />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#d32f2f" dot={false} name="ECG" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EcgChart;