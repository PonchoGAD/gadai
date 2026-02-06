import type { ReactNode } from 'react';

export const metadata = {
  title: 'GADAI',
  description: 'Осознанный разбор личности'
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
          backgroundColor: '#0f172a',
          color: '#ffffff'
        }}
      >
        {children}
      </body>
    </html>
  );
}
