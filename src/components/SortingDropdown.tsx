import React, { useState } from 'react';
import styled from 'styled-components';

interface SortOption {
  label: string;
  apiKey: string;
}

const sortOptions: SortOption[] = [
  { label: 'Relevance', apiKey: 'relevance' },
  { label: 'Price', apiKey: 'price' },
  { label: 'Shape', apiKey: 'shape' },
  { label: 'Size', apiKey: 'carat' },
  { label: 'Color', apiKey: 'color' },
  { label: 'Clarity', apiKey: 'clarity' },
  { label: 'Cut', apiKey: 'cut' },
  { label: 'Lab', apiKey: 'certificate' },
];

interface SortingDropdownProps {
  onSortSelect: (sortByApiKey: string) => void;
  currentSortByApiKey: string;
}

const SortingDropdown: React.FC<SortingDropdownProps> = ({ onSortSelect, currentSortByApiKey }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: SortOption): void => {
    onSortSelect(option.apiKey);
    setIsOpen(false);
  };

  const getCurrentLabel = () => {
    const currentOption = sortOptions.find((opt) => opt.apiKey === currentSortByApiKey);
    return currentOption ? currentOption.label : 'Relevance';
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
    font-size: 12px;

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
    background-color: #333;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  `;

  const OptionButton = styled.button<{ isHighlighted: boolean }>`
    width: 100%;
    font-size: 14px;
    text-align: left;
    border: none;
    padding: 8px 12px;
    font-size: unset;
    background-color: ${({ isHighlighted }) =>
      isHighlighted ? 'rgba(80,80,80,1)' : 'transparent'};
    color: white;

    &:hover {
      background-color: rgba(70, 70, 70, 1);
    }
    &:last-of-type {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    &:first-of-type {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
  `;

  return (
    <div>
      <DropdownContainer>
        <span>Sorting: </span>
        <DropdownButton onClick={toggleDropdown}>
          <span>{getCurrentLabel()}</span>
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
              {sortOptions.map((option) => (
                <OptionButton
                  key={option.apiKey}
                  isHighlighted={option.apiKey === currentSortByApiKey}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
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
