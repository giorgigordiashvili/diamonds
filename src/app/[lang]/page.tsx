import LanguageSwitcher from '@/components/LanguageSwitcher';
import styles from '../page.module.css';

export default async function IndexPage() {
  // Load dictionary based on the current language

  return (
    <div className={styles.page}>
      <LanguageSwitcher />
    </div>
  );
}
