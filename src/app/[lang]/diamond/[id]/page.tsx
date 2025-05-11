import DiamondDetails from '@/components/DiamondDetails'; // Import the new client component
import { getDictionary } from '@/get-dictionary';

interface DiamondDetailPageProps {
  params: Promise<{
    id: string;
    lang: string;
  }>;
}

export default async function DiamondDetailPage({ params }: DiamondDetailPageProps) {
  const { id, lang } = await params;
  const dictionary = await getDictionary(lang as any); // Fetch dictionary here

  return <DiamondDetails id={id} lang={lang} dictionary={dictionary} />;
}
