import React from 'react';
import styled from 'styled-components';

const Main = styled.div`
  width: 100%;
  height: fit-content;
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
const Cards = styled.div`
  width: 100%;
  padding: 24px;
`;
const Address = styled.div`
  width: 100%;
  padding: 24px;
`;
const Payment = () => {
  return (
    <Main>
      <Head>
        <div></div>
        <p>Payment method</p>
        <div></div>
      </Head>
      <Cards>
        <div>box</div>
        <div>box</div>
        <div>box</div>
      </Cards>
      <Head>
        <div></div>
        <p>Your personal details</p>
        <div></div>
      </Head>

      <Address>
        <div>address</div>
      </Address>
    </Main>
  );
};

export default Payment;
