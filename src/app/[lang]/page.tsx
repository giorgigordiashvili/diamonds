import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import styles from '../page.module.css';

export default async function IndexPage(props: { params: Promise<{ lang: Locale }> }) {
  // Load dictionary based on the current language
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);
  return (
    <div className={styles.page}>
      <LanguageSwitcher />
      <main className={styles.main}>
        <ol>
          <li>
            {dictionary.home.description} <code>src/app/[lang]/page.tsx</code>.
          </li>
          <li>{dictionary.home.save_changes}</li>
        </ol>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          {dictionary.home.learn}
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          {dictionary.home.examples}
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          {dictionary.home.go_to_nextjs}
        </a>
      </footer>
    </div>
  );
}
