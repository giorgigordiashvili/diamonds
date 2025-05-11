import AdminDashboardClient from '@/components/AdminDashboardClient';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
export default async function AdminPage(props: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);
  return <AdminDashboardClient adminDict={dictionary.admin} lang={lang} />;
}
