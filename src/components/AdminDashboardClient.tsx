'use client';

import AdminLogin from '@/components/AdminLogin';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import DiamondsTab from './AdminDashboard/DiamondsTab';

const AdminContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #333;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background: ${(props) => (props.active ? '#333' : 'transparent')};
  color: ${(props) => (props.active ? '#fff' : 'inherit')};
  border: none;
  cursor: pointer;
  font-size: 16px;
`;

interface AdminDashboardClientProps {
  adminDict: Awaited<ReturnType<typeof getDictionary>>['admin'];
  lang: Locale;
}

export default function AdminDashboardClient({ adminDict, lang }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState('diamonds');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const router = useRouter();

  const handleLoginSuccess = (token: string) => {
    setCookie('authToken', token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    setIsAuthenticated(true);
    setIsAdmin(true);
    setAuthChecking(false);
    fetchData();
  };

  const fetchData = useCallback(async () => {
    console.log(
      'AdminDashboardClient fetchData called - will fetch data for other tabs if implemented'
    );
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      setAuthChecking(true);
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          setIsAuthenticated(true);
          setIsAdmin(true);
          fetchData();
        } catch (error) {
          console.error('Auth check failed:', error);
          setIsAuthenticated(false);
          setIsAdmin(false);
          router.push(`/${lang}/admin-login`);
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        router.push(`/${lang}/admin-login`);
      }
      setAuthChecking(false);
    };
    checkAuth();
  }, [lang, router, fetchData]);

  if (authChecking) {
    return <div>{adminDict.loading}</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} adminDict={adminDict} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'diamonds':
        return <DiamondsTab adminDict={adminDict} />;
      case 'users':
        return <div>{adminDict.tabs.users}</div>;
      case 'carts':
        return <div>{adminDict.tabs.carts}</div>;
      case 'orders':
        return <div>{adminDict.tabs.orders}</div>;
      case 'payments':
        return <div>{adminDict.tabs.payments}</div>;
      default:
        return null;
    }
  };

  return (
    <AdminContainer>
      <Header>
        <Title>{adminDict.dashboardTitle}</Title>
        <button
          onClick={() => {
            localStorage.removeItem('authToken');
            setCookie('authToken', '', { maxAge: -1, path: '/' });
            setIsAuthenticated(false);
            setIsAdmin(false);
            router.push(`/${lang}/admin-login`);
          }}
          style={{
            padding: '8px 12px',
            background: '#333',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {adminDict.logout}
        </button>
      </Header>
      <Tabs>
        <Tab active={activeTab === 'diamonds'} onClick={() => setActiveTab('diamonds')}>
          {adminDict.tabs.diamonds}
        </Tab>
        <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          {adminDict.tabs.users}
        </Tab>
        <Tab active={activeTab === 'carts'} onClick={() => setActiveTab('carts')}>
          {adminDict.tabs.carts}
        </Tab>
        <Tab active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
          {adminDict.tabs.orders}
        </Tab>
        <Tab active={activeTab === 'payments'} onClick={() => setActiveTab('payments')}>
          {adminDict.tabs.payments}
        </Tab>
      </Tabs>
      {renderContent()}
    </AdminContainer>
  );
}
