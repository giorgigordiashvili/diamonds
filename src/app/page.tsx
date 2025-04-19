import { redirect } from 'next/navigation';

export default function Home() {
  // The middleware will handle the redirection to the appropriate language
  // This is just a fallback in case the middleware doesn't work
  redirect('/en');
}
