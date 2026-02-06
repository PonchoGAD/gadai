'use client';

import { useEffect, useState } from 'react';

export default function AccountPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null;

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(r => r.json())
      .then(setProfiles);
  }, [token]);

  return (
    <main style={{ padding: 24 }}>
      <h1>Мои разборы</h1>

      {profiles.length === 0 && <p>Разборов пока нет</p>}

      {profiles.map(p => (
        <div
          key={p.id}
          style={{
            border: '1px solid #ddd',
            padding: 16,
            marginBottom: 12
          }}
        >
          <div>
            <strong>Дата:</strong>{' '}
            {new Date(p.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Тариф:</strong> {p.tierUsed}
          </div>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(p.interpretation, null, 2)}
          </pre>
        </div>
      ))}
    </main>
  );
}
