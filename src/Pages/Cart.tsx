'use client';
import React, { useState } from 'react';
import styled from 'styled-components';
import Cartitems from '@/components/Cartitems';
import Total from '@/components/Total';

const Main = styled.div`
  margin-top: 84px;
  width: 100%;
  padding-inline: 32px;
  margin-bottom: 100px;
`;

const Choose = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  gap: 20px;
`;

const Step = styled.p<{ selected: boolean }>`
  padding-bottom: 12px;
  width: 100%;
  text-align: center;
  border-bottom: 2px solid white;
  font-size: 14px;
  font-weight: bold;
  opacity: ${({ selected }) => (selected ? 1 : 0.5)};
  cursor: pointer;
  transition: opacity 0.2s;
`;

const Page = styled.div`
  margin-top: 52px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
`;
const Login = styled.div`
  background-color: #1a1a1a;
  width: 100%;
  height: 200px;
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
  margin-top: 16px;
`;
const Contact = styled.div`
  margin-top: 60px;
  padding: 36px;
  border: 1px solid #7d7d7d;
`;

const Cart = () => {
  const [selectedStep, setSelectedStep] = useState<number>(0);

  return (
    <Main>
      <Choose>
        <Step selected={selectedStep === 0} onClick={() => setSelectedStep(0)}>
          1 Login
        </Step>
        <Step selected={selectedStep === 1} onClick={() => setSelectedStep(1)}>
          2 Payment
        </Step>
      </Choose>
      <Page>
        <Login></Login>
        <Shopping>
          <Cartitems></Cartitems>
          <Total></Total>
          <Pay>PAY AND ORDER</Pay>
          <Contact></Contact>
        </Shopping>
      </Page>
    </Main>
  );
};

export default Cart;
