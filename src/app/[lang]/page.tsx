'use client';
import { diamondsApi } from '@/api';
import Certifications from '@/components/Certifications';
import ContactForm from '@/components/ContactForm';
import DiamondQuality from '@/components/DiamondQuality';
import DiamondsFilter from '@/components/DiamondsFilter';
import DiamondsList from '@/components/DiamondsList';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import UniqueGift from '@/components/UniqueGift';
import { useState } from 'react';
import styled from 'styled-components';
import styles from '../page.module.css';

const First = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  @media screen and (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;
const Margin = styled.div`
  margin-top: 280px;
  @media screen and (max-width: 1120px) {
    margin-top: 48px;
  }
`;

const ITEMS_PER_PAGE = 10; // Define items per page

export default function IndexPage() {
  const [filters, setFilters] = useState<Partial<diamondsApi.DiamondSearchParams>>({
    page: 1, // Initialize with page 1
    limit: ITEMS_PER_PAGE, // Initialize with items per page
  });

  const handleFilterChange = (filterName: string, value: any) => {
    setFilters((prevFilters) => {
      const newFilters: Partial<diamondsApi.DiamondSearchParams> = {
        ...prevFilters,
        [filterName]: value,
        limit: ITEMS_PER_PAGE, // Ensure limit is always set
      };
      if (filterName !== 'page') {
        newFilters.page = 1; // Reset to page 1 if filter changes (excluding page itself)
      }
      console.log('Filters updated in page.tsx:', newFilters);
      return newFilters;
    });
  };

  return (
    <>
      <div className={styles.page}>
        <LanguageSwitcher />
        <First>
          <DiamondsFilter onFilterChange={handleFilterChange} currentFilters={filters} />
          <DiamondsList filterParams={filters} onFilterChange={handleFilterChange} />
        </First>
      </div>
      <Margin></Margin>
      <UniqueGift></UniqueGift>
      <DiamondQuality></DiamondQuality>
      <Certifications></Certifications>
      <ContactForm></ContactForm>
    </>
  );
}
