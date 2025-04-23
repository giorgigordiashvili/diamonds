import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-family: Arial, sans-serif;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
  text-align: left;
  align-self: flex-start;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  width: 70px;
  height: 48px;
  background-color: #333;
  border: none;
  color: white;
  font-size: 16px;
  text-align: center;
  &:focus {
    outline: none;
    background-color: #444;
  }
`;
const Dash = styled.p`
  margin-top: 10px;
`;

const Professional = () => {
  const [taffle1, setTaffle1] = useState('');
  const [taffle2, setTaffle2] = useState('');
  const [depth1, setDepth1] = useState('');
  const [depth2, setDepth2] = useState('');

  const handleTaffle1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTaffle1(value);
    console.log('Taffle 1:', value);
  };

  const handleTaffle2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTaffle2(value);
    console.log('Taffle 2:', value);
  };

  const handleDepth1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDepth1(value);
    console.log('Depth 1:', value);
  };

  const handleDepth2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDepth2(value);
    console.log('Depth 2:', value);
  };

  return (
    <Container>
      <InputWrapper>
        <Label>Taffle</Label>
        <InputContainer>
          <Input type="number" value={taffle1} onChange={handleTaffle1Change} placeholder="-" />
          <Dash>-</Dash>

          <Input type="number" value={taffle2} onChange={handleTaffle2Change} placeholder="-" />
        </InputContainer>
      </InputWrapper>
      <InputWrapper>
        <Label>Depth</Label>
        <InputContainer>
          <Input type="number" value={depth1} onChange={handleDepth1Change} placeholder="-" />
          <Dash>-</Dash>
          <Input type="number" value={depth2} onChange={handleDepth2Change} placeholder="-" />
        </InputContainer>
      </InputWrapper>
    </Container>
  );
};

export default Professional;
