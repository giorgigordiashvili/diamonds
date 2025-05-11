import { CartProvider } from '@/context/CartContext';
import type { AppProps } from 'next/app';
import StyledComponentsRegistry from '@/lib/registry'; // Assuming you want styled-components here too
import '../app/globals.css'; // Adjust path if your global styles are elsewhere

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StyledComponentsRegistry>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </StyledComponentsRegistry>
  );
}

export default MyApp;
