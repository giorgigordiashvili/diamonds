import React from 'react';
import styled from 'styled-components';

const Main = styled.div`
  div {
    padding-inline: 8px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    min-height: 18px;
    font-weight: 500;
    padding-bottom: 8px;
  }
`;
const Cost = styled.div``;
const Shipping = styled.div``;
const Grand = styled.div`
  padding-top: 12px;
  border-top: 2px solid white;
`;
const Vat = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #7d7d7d;
`;

// Define props interface
interface TotalProps {
  totalAmount: number;
  dictionary: any;
}

const Total: React.FC<TotalProps> = ({ totalAmount, dictionary }) => {
  const shippingCost = 0; // Assuming shipping is free for now
  const grandTotal = totalAmount + shippingCost;
  const vatRate = 0.19; // 19% VAT
  const vatIncluded = grandTotal - grandTotal / (1 + vatRate);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  };

  const { total } = dictionary.cart;

  return (
    <Main>
      <Cost>
        <p>{total.total}</p>
        <p>{formatCurrency(totalAmount)}</p>
      </Cost>
      <Shipping>
        <p>{total.shippingCosts}</p>
        <p>{formatCurrency(shippingCost)}</p>
      </Shipping>
      <Grand>
        <p>{total.grandTotal}</p>
        <p>{formatCurrency(grandTotal)}</p>
      </Grand>
      <Vat>
        <p>{total.vatIncluded}</p>
        <p>{formatCurrency(vatIncluded)}</p>
      </Vat>
    </Main>
  );
};

export default Total;
