import type { Metadata } from 'next';
import '../globals.css';

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
    <>
      <main
        style={{
          backgroundColor: '#000',
          color: '#fff',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </main>
    </>
  );
}
