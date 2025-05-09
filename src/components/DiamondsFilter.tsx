'use client';
import { diamondsApi } from '@/api';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DiamondsSection from './DiamondsSection';
import MobileFilter from './MobileFilter';

const Head = styled.div`
  margin-bottom: 30px;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  @media screen and (max-width: 980px) {
    margin-inline: 16px;
    text-align: center;
    border: 2px solid rgba(255, 255, 255, 1);
    height: 44px;
    align-content: center;
    font-size: 14px;
  }
`;

interface DiamondsFilterProps {
  onFilterChange: (filterName: string, value: any) => void;
  currentFilters: Partial<diamondsApi.DiamondSearchParams>; // Add currentFilters prop
}

const DiamondsFilter: React.FC<DiamondsFilterProps> = ({ onFilterChange, currentFilters }) => {
  const [showFilter, setShowFilter] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 980);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div>
      <Head onClick={() => setShowFilter((prev) => !prev)}>Configure diamond</Head>
      {showFilter &&
        (isMobile ? (
          <MobileFilter
            onClose={() => setShowFilter(false)}
            onFilterChange={onFilterChange}
            currentFilters={currentFilters} // Pass currentFilters
          />
        ) : (
          <DiamondsSection onFilterChange={onFilterChange} currentFilters={currentFilters} /> // Pass currentFilters
        ))}
    </div>
  );
};

export default DiamondsFilter;
