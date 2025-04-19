'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../app/page.module.css';

const LanguageSwitcher = () => {
  const pathname = usePathname();

  // Extract the current locale from pathname
  const currentLocale = pathname.split('/')[1];

  // Determine the alternative locale
  const alternateLocale = currentLocale === 'en' ? 'ka' : 'en';

  // Get the path without the locale prefix
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';

  // Create the new path with the alternate locale
  const newPath = `/${alternateLocale}${pathWithoutLocale}`;

  return (
    <div className={styles.languageSwitch}>
      <Link href={newPath}>{alternateLocale === 'en' ? 'English' : 'ქართული'}</Link>
    </div>
  );
};

export default LanguageSwitcher;
