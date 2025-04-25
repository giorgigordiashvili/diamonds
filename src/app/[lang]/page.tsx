'use client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import styles from '../page.module.css';
import DiamondsFilter from '@/components/DiamondsFilter';
import DiamondsList from '@/components/DiamondsList';
import styled from 'styled-components';

const First = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  @media screen and (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;
export default function IndexPage() {
  return (
    <div className={styles.page}>
      <LanguageSwitcher />
      <First>
        <DiamondsFilter />
        <DiamondsList />
      </First>
    </div>
  );
}
