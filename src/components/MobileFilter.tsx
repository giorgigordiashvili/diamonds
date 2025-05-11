import { diamondsApi } from '@/api'; // Import diamondsApi
import { getDictionary } from '@/get-dictionary'; // Import getDictionary
import React from 'react';
import styled from 'styled-components';
import DiamondsSection from './DiamondsSection';

const Aside = styled.div`
  width: 100%;
  position: fixed;
  height: 100%;
  z-index: 100;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
`;

const Filter = styled.div`
  background-color: black;
  border-right: 2px solid white;
  height: 100%;
  width: 80%;
  padding: 36px 16px;
  position: relative;
  overflow-y: scroll;
`;

const Close = styled.div`
  position: absolute;
  width: 44px;
  height: 44px;
  border: 2px solid white;
  right: 20px;
  top: 20px;
  background-color: #262626;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  cursor: pointer;
`;

interface MobileFilterProps {
  onClose: () => void;
  onFilterChange: (filterName: string, value: any) => void;
  currentFilters: Partial<diamondsApi.DiamondSearchParams>; // Add currentFilters prop
  dictionary: Awaited<ReturnType<typeof getDictionary>>['diamondsSection'];
}

const MobileFilter: React.FC<MobileFilterProps> = ({
  onClose,
  onFilterChange,
  currentFilters,
  dictionary,
}) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); // Only close if the actual background (Aside) is clicked
    }
  };

  return (
    <Aside onClick={handleBackgroundClick}>
      <Filter onClick={(e) => e.stopPropagation()}>
        {/* Pass onFilterChange, currentFilters, and dictionary to DiamondsSection */}
        <DiamondsSection
          onFilterChange={onFilterChange}
          currentFilters={currentFilters}
          dictionary={dictionary}
        />
      </Filter>
      <Close onClick={onClose}>×</Close>
    </Aside>
  );
};

export default MobileFilter;
