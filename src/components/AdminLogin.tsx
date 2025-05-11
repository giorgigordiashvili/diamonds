'use client';

import { getDictionary } from '@/get-dictionary';
import React, { useState } from 'react';
import styled from 'styled-components';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  border: 1px solid #333;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #333;
  background: transparent;
  color: inherit;
`;

const Button = styled.button`
  padding: 12px;
  background: #333;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;

  &:hover {
    background: #555;
  }
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  margin-top: 15px;
  text-align: center;
`;

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  adminDict: Awaited<ReturnType<typeof getDictionary>>['admin'];
}

const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call login API
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.role !== 'admin') {
        throw new Error('You do not have admin privileges');
      }

      // Save token to localStorage
      localStorage.setItem('authToken', data.token);

      // Call the onLoginSuccess callback with the token
      onLoginSuccess(data.token);
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Title>Admin Login</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
    </LoginContainer>
  );
};

export default AdminLogin;
