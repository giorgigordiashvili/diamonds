'use client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import styles from '../page.module.css';
import DiamondsSection from '@/components/DiamondsSection';

export default function IndexPage() {
  return (
    <div className={styles.page}>
      <LanguageSwitcher />
      <DiamondsSection />
    </div>
  );
}
