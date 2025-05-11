'use client';

import Billing from '@/components/Billing';
import Cartitems from '@/components/Cartitems';
import Customer from '@/components/Customer';
import Data from '@/components/Data';
import Total from '@/components/Total';
import { useCart } from '@/context/CartContext'; // Import useCart
import styled from 'styled-components';

const Main = styled.div`
  margin-top: 84px;
  width: 100%;
  padding-inline: 32px;
  margin-bottom: 100px;
  @media screen and (max-width: 600px) {
    padding-inline: 16px;
  }
`;

const Page = styled.div`
  margin-top: 52px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  @media screen and (max-width: 1120px) {
    grid-template-columns: 1fr;
  }
`;

const Left = styled.div`
  background-color: #1a1a1a;
  width: 100%;
  height: fit-content;
  padding: 20px 36px;
  @media screen and (max-width: 600px) {
    padding-inline: 16px;
  }
`;

const Shopping = styled.div`
  width: 100%;
`;

const Pay = styled.div`
  width: 100%;
  background: linear-gradient(180deg, #c60000 0%, #840101 100%);
  height: 54px;
  text-align: center;
  border-radius: 10px;
  align-content: center;
  font-weight: 700;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0.56px;
  text-align: center;
  vertical-align: middle;
  margin-top: 24px;
`;

const Final = styled.div`
  width: 100%;
  padding: 36px 40px;
  background-color: #1a1a1a;
  height: fit-content;
  border: 1px solid #7d7d7d;
  border-top: unset;
  margin-bottom: 24px;
`;

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount, isLoading } =
    useCart();

  if (isLoading) {
    return (
      <Main>
        <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading cart...</p>
      </Main>
    );
  }

  // Get cart count
  const cartCount = getCartCount();

  return (
    <Main>
      {/* Add a title that reflects the cart count */}
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Your Shopping Cart{' '}
        {cartCount > 0 ? `(${cartCount} item${cartCount > 1 ? 's' : ''})` : 'is empty'}
      </h1>

      {/* You can conditionally render either login or payment step */}
      <Page>
        <Left>
          <Customer />
          <Data />
          <Billing />
        </Left>
        <Shopping>
          <Cartitems
            items={cartItems}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />{' '}
          {/* Pass props */}
          <Final>
            <Total totalAmount={getCartTotal()} /> {/* Pass props */}
          </Final>
          <Pay onClick={() => {}}>PAY AND ORDER</Pay>
        </Shopping>
      </Page>
    </Main>
  );
};

export default Cart;
