'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');

  function submit() {
    if (!date) return;

    localStorage.setItem(
      'profileInput',
      JSON.stringify({
        date_of_birth: date,
        time_of_birth: time || null,
        place_of_birth: place || null,
        locale: 'ru'
      })
    );

    router.push('/result');
  }

  return (
    <main style={styles.page}>
      {/* NAV */}
      <header style={styles.header}>
        <div style={styles.logo}>GADAI</div>
        <nav style={styles.nav}>
          <a href="/" style={styles.navLink}>Главная</a>
          <a href="/result" style={styles.navLink}>Результат</a>
          <a href="/account" style={styles.navLink}>Личный кабинет</a>
          <a href="/shop" style={styles.navLink}>Магазин</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          Персональный разбор  
          <span style={styles.gold}> твоей природы и пути</span>
        </h1>

        <p style={styles.subtitle}>
          GADAI — это интеллектуальный анализ твоих врождённых параметров
          через астрономию, числа и психологические архетипы.
          <br />
          <span style={styles.dim}>
            Без фатальных приговоров. Без мистического шума.  
            Только структура, смысл и выбор.
          </span>
        </p>

        {/* FORM */}
        <div style={styles.form}>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={styles.input}
          />

          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Место рождения (город, страна)"
            value={place}
            onChange={e => setPlace(e.target.value)}
            style={styles.input}
          />

          <button onClick={submit} style={styles.button}>
            Узнать свой профиль
          </button>

          <p style={styles.note}>
            Если время рождения неизвестно — анализ всё равно возможен.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Как это работает</h2>

        <div style={styles.steps}>
          <div style={styles.step}>
            <span style={styles.stepNumber}>01</span>
            <p>
              Мы вычисляем объективные параметры твоего рождения
              — без интерпретаций и предположений.
            </p>
          </div>

          <div style={styles.step}>
            <span style={styles.stepNumber}>02</span>
            <p>
              Формируем структурированный профиль:
              сильные стороны, ограничения, архетипы.
            </p>
          </div>

          <div style={styles.step}>
            <span style={styles.stepNumber}>03</span>
            <p>
              AI-психолог переводит сухие данные
              в понятный и прикладной смысл.
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section style={styles.sectionAlt}>
        <h2 style={styles.sectionTitle}>О проекте GADAI</h2>

        <p style={styles.text}>
          Этот проект создан для людей, которые чувствуют,
          что в них заложено больше, чем они сейчас реализуют.
        </p>

        <p style={styles.text}>
          Мы не предсказываем судьбу.
          Мы показываем карту — а путь ты выбираешь сам.
        </p>

        <p style={styles.textDim}>
          GADAI объединяет строгие вычисления,
          архетипическую психологию и AI-интерпретацию,
          чтобы дать тебе опору, ясность и направление.
        </p>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © {new Date().getFullYear()} GADAI  
          <span style={styles.gold}> · Осознанность как система</span>
        </p>
      </footer>
    </main>
  );
}

/* ===================== STYLES ===================== */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, #111827, #0B0E14)',
    color: '#E5E7EB',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 32px',
    borderBottom: '1px solid rgba(212,175,55,0.15)'
  },

  logo: {
    fontSize: 22,
    letterSpacing: 2,
    color: '#D4AF37',
    fontWeight: 600
  },

  nav: {
    display: 'flex',
    gap: 24
  },

  navLink: {
    color: '#9CA3AF',
    textDecoration: 'none',
    fontSize: 14
  },

  hero: {
    padding: '80px 24px',
    textAlign: 'center'
  },

  title: {
    fontSize: 42,
    marginBottom: 20,
    lineHeight: 1.2
  },

  gold: {
    color: '#D4AF37'
  },

  subtitle: {
    maxWidth: 720,
    margin: '0 auto 48px',
    fontSize: 18,
    lineHeight: 1.6
  },

  dim: {
    opacity: 0.7
  },

  form: {
    maxWidth: 420,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },

  input: {
    padding: 14,
    borderRadius: 10,
    border: '1px solid rgba(212,175,55,0.3)',
    background: '#0B0E14',
    color: '#E5E7EB'
  },

  button: {
    marginTop: 8,
    padding: '14px 24px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #D4AF37, #F5C77A)',
    color: '#0B0E14',
    fontSize: 16,
    cursor: 'pointer'
  },

  note: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 8
  },

  section: {
    padding: '80px 24px',
    maxWidth: 1000,
    margin: '0 auto'
  },

  sectionAlt: {
    padding: '80px 24px',
    background: 'rgba(255,255,255,0.02)'
  },

  sectionTitle: {
    fontSize: 28,
    marginBottom: 32,
    textAlign: 'center'
  },

  steps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 32
  },

  step: {
    padding: 24,
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: 16
  },

  stepNumber: {
    color: '#D4AF37',
    fontSize: 14,
    letterSpacing: 1
  },

  text: {
    maxWidth: 720,
    margin: '0 auto 16px',
    textAlign: 'center',
    fontSize: 16
  },

  textDim: {
    maxWidth: 720,
    margin: '0 auto',
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7
  },

  footer: {
    padding: 32,
    textAlign: 'center',
    borderTop: '1px solid rgba(212,175,55,0.15)'
  },

  footerText: {
    fontSize: 14,
    opacity: 0.6
  }
};
