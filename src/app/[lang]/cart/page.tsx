import Cart from '@/components/Cart';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

export default async function CartPage(props: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);
  return <Cart dictionary={dictionary} />;
}
