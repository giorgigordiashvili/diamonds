import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 5px;
`;

const Select = styled.select`
  background-color: black;
  color: white;
  border: #fff 2px solid;
  padding: 0px 16px;
  border: 1px solid white;
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position: right 5px center;
  padding-right: 25px;
  width: 100%;
  height: 32px;

  &:focus {
    outline: none;
  }

  option {
    background-color: black;
    color: white;
  }
`;

const Dash = styled.span`
  color: white;
  font-size: 16px;
`;

const ColorDropdown = () => {
  const options = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
  const [fromValue, setFromValue] = useState('from');
  const [toValue, setToValue] = useState('to');

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setFromValue(selectedValue);
    if (selectedValue !== 'from') {
      console.log('From selected:', selectedValue);
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setToValue(selectedValue);
    if (selectedValue !== 'to') {
      console.log('To selected:', selectedValue);
    }
  };

  return (
    <Container>
      <Select value={fromValue} onChange={handleFromChange}>
        <option value="from">from</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
      <Dash>-</Dash>
      <Select value={toValue} onChange={handleToChange}>
        <option value="to">to</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </Container>
  );
};

export default ColorDropdown;
