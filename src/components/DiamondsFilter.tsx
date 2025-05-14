'use client';
import { diamondsApi } from '@/api';
import { getDictionary } from '@/get-dictionary';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DiamondsSection from './DiamondsSection';
import MobileFilter from './MobileFilter';

const Main = styled.div`
  min-width: 260px;
  @media screen and (max-width: 1150px) {
    min-width: unset;
    width: 100%;
  }
`;
const Head = styled.div`
  margin-bottom: 30px;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  @media screen and (max-width: 1150px) {
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
  currentFilters: Partial<diamondsApi.DiamondSearchParams>;
  dictionary: Awaited<ReturnType<typeof getDictionary>>['diamondsSection'];
}

const DiamondsFilter: React.FC<DiamondsFilterProps> = ({
  onFilterChange,
  currentFilters,
  dictionary,
}) => {
  const [showFilter, setShowFilter] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1150);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Main>
      <Head onClick={() => setShowFilter((prev) => !prev)}>{dictionary.configureDiamond}</Head>
      {showFilter &&
        (isMobile ? (
          <MobileFilter
            onClose={() => setShowFilter(false)}
            onFilterChange={onFilterChange}
            currentFilters={currentFilters}
            dictionary={dictionary} // Pass dictionary
          />
        ) : (
          <DiamondsSection
            onFilterChange={onFilterChange}
            currentFilters={currentFilters}
            dictionary={dictionary}
          /> // Pass dictionary
        ))}
    </Main>
  );
};

export default DiamondsFilter;
