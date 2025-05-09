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

const Total = () => {
  return (
    <Main>
      <Cost>
        <p>Total</p>
        <p>10000 €</p>
      </Cost>
      <Shipping>
        <p>Shipping costs</p>
        <p>0 €</p>
      </Shipping>
      <Grand>
        <p>Grand total</p>
        <p>10000 €</p>
      </Grand>
      <Vat>
        <p>19% VAT. included:</p>
        <p>333,06 €</p>
      </Vat>
    </Main>
  );
};

export default Total;
