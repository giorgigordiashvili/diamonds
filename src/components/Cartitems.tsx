'use client';
import { CartItem } from '@/types/cart';
import { MinusCircle, PlusCircle, Trash } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

const Main = styled.div`
  width: 100%;
  height: fit-content;
  padding: 20px 36px;
  border: 1px solid #7d7d7d;
  @media screen and (max-width: 600px) {
    padding-inline: 16px;
  }
`;

const Head = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  text-align: center;
  align-items: center;
  gap: 16px;

  div {
    background-color: white;
    height: 2px;
  }

  p {
    font-size: 18px;
    font-weight: 600;
  }
`;

const DiamondStyled = styled.div`
  padding-bottom: 12px;
  border-bottom: 1px solid white;

  &:last-of-type {
    border-bottom: unset;
  }
`;

const Item = styled.div`
  display: flex;
  width: 100%;
  padding: 20px 12px;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
`;

const Desc = styled.div`
  margin-inline: 32px;
  @media screen and (max-width: 1120px) {
    margin-right: auto;
  }
`;

const Name = styled.div`
  font-weight: 300;
  font-size: 16px;
`;

const Description = styled.div`
  color: #a8a8a8;
  font-size: 12px;
`;

const Moreinfo = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 20px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
  }
`;

const Quant = styled.div`
  font-size: 16px;
  min-width: 20px;
  text-align: center;
`;

const Price = styled.div``;

const Cost = styled.div`
  font-weight: bold;
  font-size: 12px;
`;

const Tax = styled.div`
  font-weight: bold;
  color: #a8a8a8;
  font-size: 10px;
`;

const Trashcan = styled.div`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

interface CartitemsProps {
  items: CartItem[];
  removeFromCart: (diamondId: string) => void;
  updateQuantity: (diamondId: string, quantity: number) => void;
}

const Cartitems: React.FC<CartitemsProps> = ({ items, removeFromCart, updateQuantity }) => {
  if (!items || items.length === 0) {
    return (
      <Main>
        <Head>
          <div></div>
          <p>Your Shopping Cart</p>
          <div></div>
        </Head>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Your cart is currently empty.</p>
      </Main>
    );
  }

  return (
    <Main>
      <Head>
        <div></div>
        <p>Your Shopping Cart</p>
        <div></div>
      </Head>

      {items.map((item) => {
        // Log item price and quantity to help debug NaN issues
        console.log(
          `CartItem: ID=${item.diamondId}, Price=${item.price}, Quantity=${item.quantity}`
        );

        console.log(item);

        const totalPriceForItem = item.price * item.quantity;
        // Check if totalPriceForItem is NaN and log if it is
        if (isNaN(totalPriceForItem)) {
          console.error('NaN detected for item:', item);
        }

        return (
          <DiamondStyled key={item.diamondId}>
            <Item>
              <Image
                src={item?.diamond?.image || '/assets/diamonds/Diamant.png'}
                alt={item?.diamond?.name_en || 'Diamond'}
                width={70}
                height={70}
                style={{ objectFit: 'cover', borderRadius: '4px' }}
              />
              <Desc>
                <Name>{item?.diamond?.name_en}</Name>
                <Description>
                  {`Shape: ${item?.diamond?.shape}, Carat: ${item?.diamond?.carat.toFixed(2)}, Color: ${item?.diamond?.color}, Clarity: ${item?.diamond?.clarity}`}
                </Description>
                <Moreinfo>
                  <QuantityControl>
                    <button
                      onClick={() => updateQuantity(item.diamondId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <MinusCircle size={20} />
                    </button>
                    <Quant>{item.quantity}</Quant>
                    <button onClick={() => updateQuantity(item.diamondId, item.quantity + 1)}>
                      <PlusCircle size={20} />
                    </button>
                  </QuantityControl>
                  <Price>
                    {/* Display item price (price per unit * quantity) */}
                    <Cost>
                      {isNaN(totalPriceForItem)
                        ? 'Error'
                        : totalPriceForItem.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                    </Cost>
                    <Tax>incl. VAT, free insured shipping</Tax>
                  </Price>
                </Moreinfo>
              </Desc>
              <Trashcan onClick={() => removeFromCart(item.diamondId)}>
                <Trash style={{ maxWidth: '24px' }} color="white" size={16} />
              </Trashcan>
            </Item>
          </DiamondStyled>
        );
      })}
    </Main>
  );
};

export default Cartitems;
