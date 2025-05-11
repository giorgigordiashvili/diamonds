'use client';

import AdminLogin from '@/components/AdminLogin';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import DiamondsTab from './AdminDashboard/DiamondsTab';
import OrdersTab from './AdminDashboard/OrdersTab'; // Import OrdersTab
import UsersTab from './AdminDashboard/UsersTab'; // Import UsersTab

const AdminContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Helvetica Neue', Arial, sans-serif; // Add a modern font stack
`;

const Header = styled.header`
  background-color: #f8f9fa; // Lighter background for the header
  padding: 20px; // Increased padding
  border-radius: 8px; // Rounded corners
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Subtle shadow for depth
`;

const Title = styled.h1`
  font-size: 28px; // Slightly larger font size
  font-weight: 500; // Medium weight for a modern feel
  color: #343a40; // Darker color for better contrast
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #dee2e6; // Slightly thicker and lighter border
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 24px; // Increased padding for tabs
  background: transparent; // Default transparent background
  color: ${(props) => (props.active ? '#007bff' : '#495057')}; // Blue for active, gray for inactive
  border: none;
  border-bottom: ${(props) =>
    props.active ? '2px solid #007bff' : '2px solid transparent'}; // Active tab indicator
  cursor: pointer;
  font-size: 16px;
  font-weight: 500; // Medium weight for tab text
  transition:
    color 0.2s ease-in-out,
    border-bottom-color 0.2s ease-in-out; // Smooth transition

  &:hover {
    color: #0056b3; // Darker blue on hover
  }
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
        return <UsersTab adminDict={adminDict} lang={lang} />; // Pass lang to UsersTab

      case 'orders':
        return <OrdersTab adminDict={adminDict} lang={lang} />; // Pass lang to OrdersTab
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
            padding: '10px 15px', // Adjusted padding
            background: '#dc3545', // Red color for logout button
            color: 'white',
            border: 'none',
            borderRadius: '5px', // Rounded corners for button
            cursor: 'pointer',
            fontSize: '14px', // Adjusted font size
            fontWeight: '500',
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
      </Tabs>
      {renderContent()}
    </AdminContainer>
  );
}
