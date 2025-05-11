'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContainer = styled.div`
  background-color: white; // Changed to white
  padding: 30px; // Increased padding
  border-radius: 0; // Boxy appearance
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); // Adjusted shadow for light bg
  width: 400px; // Increased width
  color: black; // Text color black
  position: relative;
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 25px; // Adjusted margin
  text-align: center;
  font-weight: 300; // Lighter font weight for title
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 18px;
  border: 1px solid #ccc; // Lighter border for light theme
  border-radius: 0;
  background: white; // White input background
  color: black; // Black text in input
  font-size: 16px;
`;

const Button = styled.button`
  padding: 12px;
  background-color: #333; // Dark background for button
  color: white; // Light text for button
  border: none;
  border-radius: 0;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  font-weight: 600;

  &:hover {
    background-color: #555; // Darker hover for button
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #333; // Darker close icon for light bg
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9em;
  text-align: center;
`;

interface RegisterPopupProps {
  onClose: () => void;
  onRegisterSuccess: () => void;
}

const RegisterPopup: React.FC<RegisterPopupProps> = ({ onClose, onRegisterSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Replace with your actual register API endpoint
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      onRegisterSuccess();
      onClose(); // Close popup on successful registration
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>Register</Title>
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
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Form>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default RegisterPopup;
