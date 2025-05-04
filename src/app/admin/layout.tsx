import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Diamond Admin Dashboard',
  description: 'Admin dashboard for managing diamonds and orders',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header
          style={{
            backgroundColor: '#222',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Diamond Admin</div>
          <nav>
            <Link
              href="/admin"
              style={{
                color: '#fff',
                marginRight: '1rem',
                textDecoration: 'none',
              }}
            >
              Dashboard
            </Link>
            <Link
              href="/"
              style={{
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              Main Site
            </Link>
          </nav>
        </header>
        <main
          style={{
            backgroundColor: '#000',
            color: '#fff',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
