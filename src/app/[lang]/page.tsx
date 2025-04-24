'use client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import styles from '../page.module.css';
import DiamondsFilter from '@/components/DiamondsFilter';

export default function IndexPage() {
  return (
    <div className={styles.page}>
      <LanguageSwitcher />
      <DiamondsFilter />
    </div>
  );
}
