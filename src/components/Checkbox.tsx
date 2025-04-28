import React from 'react';
import styled from 'styled-components';

interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Styled component for the container
const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-family: Arial, sans-serif;
  font-size: 14px;
`;

// Styled component for the checkbox input
const CheckboxInput = styled.input`
  margin-right: 10px;
  width: 36px;
  height: 18px;
  cursor: pointer;
  appearance: none;
  border: 2px solid white;
  background-color: transparent;
  align-items: center;
  justify-content: center;
  display: flex;

  &:checked {
    background-color: white;
  }

  &:checked::before {
    content: '✔';
    display: block;
    text-align: center;
    color: rgba(168, 168, 168, 1);
    font-size: 12px;
    line-height: 18px;
  }

  @media screen and (max-width: 900px) {
    max-width: 18px;
  }
`;

// Styled component for the label
const Label = styled.label`
  user-select: none;
  color: gray;

  span {
    color: white;
  }

  ${CheckboxInput}:checked + & {
    color: white;

    span {
      color: white;
    }
  }
`;

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e); // Call the passed onChange handler
  };

  return (
    <CheckboxContainer>
      <CheckboxInput type="checkbox" checked={checked} onChange={handleChange} />
      <Label>
        By selecting continue you confirm that you have read our
        <span> data protection information</span> and accepted our
        <span> general terms and conditions.</span>
      </Label>
    </CheckboxContainer>
  );
};

export default Checkbox;
