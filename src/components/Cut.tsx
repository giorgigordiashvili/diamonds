'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components for the dropdown and layout
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

interface CutDropdownProps {
  onCutChange: (from: string | undefined, to: string | undefined) => void;
  initialMin?: string;
  initialMax?: string;
}

const CutDropdown = ({ onCutChange, initialMin = 'from', initialMax = 'to' }: CutDropdownProps) => {
  const options = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
  const [fromValue, setFromValue] = useState(initialMin);
  const [toValue, setToValue] = useState(initialMax);

  const getCutIndex = (cut: string) => options.indexOf(cut);

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFromValue = e.target.value;
    setFromValue(newFromValue);

    let currentToValue = toValue;
    // If "from" is not the placeholder and "to" is not the placeholder,
    // and the new "from" value is worse than the current "to" value,
    // then update "to" to be the same as "from".
    if (
      newFromValue !== 'from' &&
      currentToValue !== 'to' &&
      getCutIndex(newFromValue) > getCutIndex(currentToValue)
    ) {
      setToValue(newFromValue);
      currentToValue = newFromValue;
    }

    onCutChange(
      newFromValue === 'from' ? undefined : newFromValue,
      currentToValue === 'to' ? undefined : currentToValue
    );
  };

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newToValue = e.target.value;
    setToValue(newToValue);

    let currentFromValue = fromValue;
    // If "to" is not the placeholder and "from" is not the placeholder,
    // and the new "to" value is better than the current "from" value,
    // then update "from" to be the same as "to".
    if (
      newToValue !== 'to' &&
      currentFromValue !== 'from' &&
      getCutIndex(newToValue) < getCutIndex(currentFromValue)
    ) {
      setFromValue(newToValue);
      currentFromValue = newToValue;
    }

    onCutChange(
      currentFromValue === 'from' ? undefined : currentFromValue,
      newToValue === 'to' ? undefined : newToValue
    );
  };

  const fromOptions =
    toValue === 'to'
      ? options
      : options.filter((option) => getCutIndex(option) <= getCutIndex(toValue));

  const toOptions =
    fromValue === 'from'
      ? options
      : options.filter((option) => getCutIndex(option) >= getCutIndex(fromValue));

  return (
    <Container>
      <Select value={fromValue} onChange={handleFromChange}>
        <option value="from">from</option>
        {fromOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
      <Dash>-</Dash>
      <Select value={toValue} onChange={handleToChange}>
        <option value="to">to</option>
        {toOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </Container>
  );
};

export default CutDropdown;
