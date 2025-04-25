import React, { useState } from 'react';
import styled from 'styled-components';

const SortingDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('Relevance');

  const options: string[] = [
    'Relevance',
    'Price',
    'Shape',
    'Size',
    'Color',
    'Clarity',
    'Cut',
    'Lab',
  ];

  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string): void => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const DropdownContainer = styled.div`
    display: inline-block;
    text-align: left;
    font-weight: 700;
    font-size: 12.69px;
    line-height: 32px;
    text-align: right;
  `;

  const DropdownButton = styled.button`
    width: 80px;
    position: relative;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    background-color: unset;
    color: unset;
    border: none;
    color: rgba(168, 168, 168, 1);
    font-weight: 400;
    font-size: 12;

    &:focus {
      outline: none;
    }
  `;

  const DropdownMenu = styled.div`
    position: absolute;
    top: 23px;
    z-index: 10;
    width: 100%;
    border-bottom: none;
  `;

  const OptionButton = styled.button<{ isHighlighted: boolean }>`
    width: 100%;
    font-size: 14px;
    text-align: left;
    border: none;
    padding-left: 4px;
    font-size: unset;

    &:hover {
      background-color: gray;
    }
    &:last-of-type {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
    &:first-of-type {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  `;

  return (
    <div>
      <DropdownContainer>
        <span>Sorting: </span>
        <DropdownButton onClick={toggleDropdown}>
          <span>{selectedOption}</span>
          <svg
            style={{ width: '20px', height: '20px', marginLeft: '8px', marginRight: '-4px' }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {isOpen && (
            <DropdownMenu>
              {options.map((option) => (
                <OptionButton
                  key={option}
                  isHighlighted={option === 'Shape'}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </OptionButton>
              ))}
            </DropdownMenu>
          )}
        </DropdownButton>
      </DropdownContainer>
    </div>
  );
};

export default SortingDropdown;
