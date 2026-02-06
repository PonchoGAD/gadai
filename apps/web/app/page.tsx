'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [date, setDate] = useState('');
  const router = useRouter();

  function submit() {
    if (!date) return;

    localStorage.setItem(
      'profileInput',
      JSON.stringify({
        date_of_birth: date,
        locale: 'ru'
      })
    );

    router.push('/result');
  }

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Узнай свой профиль</h1>
      <p style={styles.subtitle}>
        Мы используем астрологию, нумерологию и психологию,
        чтобы дать прикладный разбор — без фатализма.
      </p>

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        style={styles.input}
      />

      <button onClick={submit} style={styles.button}>
        Продолжить
      </button>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    background: '#0f172a',
    color: '#fff'
  },
  title: {
    fontSize: 32,
    marginBottom: 12
  },
  subtitle: {
    maxWidth: 420,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.85
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: 'none',
    marginBottom: 16
  },
  button: {
    padding: '12px 24px',
    borderRadius: 8,
    border: 'none',
    background: '#6366f1',
    color: '#fff',
    fontSize: 16,
    cursor: 'pointer'
  }
};
