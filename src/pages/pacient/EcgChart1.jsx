import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function EcgChart1({ ecgString }) {
  // Dacă ecgString e deja array, folosește-l direct
  const data = Array.isArray(ecgString)
    ? ecgString.map((v, idx) => ({ idx, value: Number(v) }))
    : [];

  if (!data.length) return <div>Nu există date ECG.</div>;

  return (
    <div>
      <h3>Monitorizare ECG</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="idx" hide />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#e23b3b" dot={false} name="ECG" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EcgChart1;