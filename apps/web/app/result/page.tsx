'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [input, setInput] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('profileInput');
    if (stored) {
      setInput(JSON.parse(stored));
    }
  }, []);

  if (!input) {
    return <p style={{ padding: 24 }}>Загрузка…</p>;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Ваш базовый профиль</h1>

      <p>
        <strong>Дата рождения:</strong> {input.date_of_birth}
      </p>

      <p>
        Это базовый бесплатный результат.
        Более глубокий разбор будет доступен далее.
      </p>

      <button style={{ marginTop: 24 }}>
        Хочу глубже
      </button>
    </main>
  );
}
