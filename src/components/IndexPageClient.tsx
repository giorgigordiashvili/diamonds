'use client';
import { diamondsApi } from '@/api';
import Certifications from '@/components/Certifications';
import ContactForm from '@/components/ContactForm';
import DiamondQuality from '@/components/DiamondQuality';
import DiamondsFilter from '@/components/DiamondsFilter';
import DiamondsList from '@/components/DiamondsList';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import UniqueGift from '@/components/UniqueGift';
import { getDictionary } from '@/get-dictionary';
import { useState } from 'react'; // Removed useEffect
import styled from 'styled-components';
import styles from '../app/page.module.css'; // Adjusted path

const First = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-around;
  gap: 50px;
  @media screen and (max-width: 1150px) {
    grid-template-columns: 1fr;
  }
`;
const Margin = styled.div`
  margin-top: 280px;
  @media screen and (max-width: 1120px) {
    margin-top: 48px;
  }
`;

const ITEMS_PER_PAGE = 10;

interface IndexPageClientProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}

export default function IndexPageClient({ dictionary }: IndexPageClientProps) {
  const [filters, setFilters] = useState<Partial<diamondsApi.DiamondSearchParams>>({
    page: 1,
    limit: ITEMS_PER_PAGE,
  });

  const handleFilterChange = (filterName: string, value: any) => {
    setFilters((prevFilters) => {
      const newFilters: Partial<diamondsApi.DiamondSearchParams> = {
        ...prevFilters,
        [filterName]: value,
        limit: ITEMS_PER_PAGE,
      };
      if (filterName !== 'page') {
        newFilters.page = 1;
      }
      console.log('Filters updated in IndexPageClient.tsx:', newFilters);
      return newFilters;
    });
  };

  if (!dictionary) {
    return <div>Loading...</div>; // Fallback if dictionary is not yet available
  }

  return (
    <>
      <div className={styles.page}>
        <LanguageSwitcher />
        <First>
          <DiamondsFilter
            onFilterChange={handleFilterChange}
            currentFilters={filters}
            dictionary={dictionary.diamondsSection}
          />
          <DiamondsList
            filterParams={filters}
            onFilterChange={handleFilterChange}
            dictionary={dictionary.diamondsList}
          />
        </First>
      </div>
      <Margin></Margin>
      <UniqueGift dictionary={dictionary.pageContent.uniqueGift}></UniqueGift>
      <DiamondQuality dictionary={dictionary.pageContent.diamondQuality}></DiamondQuality>
      <Certifications dictionary={dictionary.pageContent.certifications}></Certifications>
      <ContactForm dictionary={dictionary.pageContent.contactForm}></ContactForm>
    </>
  );
}
