'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Cartitems from '@/components/Cartitems';
import Total from '@/components/Total';
import Customer from '@/components/Customer';
import Data from '@/components/Data';
import Billing from '@/components/Billing';
import Checkbox from '@/components/Checkbox';
import Payment from '@/components/Payment';

const Main = styled.div`
  margin-top: 84px;
  width: 100%;
  padding-inline: 32px;
  margin-bottom: 100px;
  @media screen and (max-width: 600px) {
    padding-inline: 16px;
  }
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

const Code = styled.div`
  background-color: #262626;
  display: flex;
  width: 100%;
  margin-bottom: 24px;
  align-items: center;
  padding-right: 12px;
  justify-content: space-between;

  div {
    font-weight: 700;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 2px;
  }

  input {
    background-color: unset;
    padding: 12px;
    border: none;
    width: 100%;
    outline: none;
  }
`;

const Cart = () => {
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const [agreed, setAgreed] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreed(e.target.checked);
  };

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

      {/* You can conditionally render either login or payment step */}
      {selectedStep === 0 ? (
        <Page>
          <Left>
            <Customer />
            <Data />
            <Billing />
          </Left>
          <Shopping>
            <Cartitems />
            <Final>
              <Total />
            </Final>
            <Pay onClick={() => setSelectedStep(1)}>PAY AND ORDER</Pay>
          </Shopping>
        </Page>
      ) : (
        <Page>
          <Left>
            <Payment />
          </Left>
          <Shopping>
            <Cartitems />
            <Final>
              <Total />
              <Code>
                <input type="text" name="giftcode" id="giftcode" placeholder="Enter gift code *" />
                <div>
                  APPLY <p>&#8250;</p>
                </div>
              </Code>
              <textarea
                name="comment"
                id="comment"
                placeholder="Comment here..."
                style={{
                  resize: 'none',
                  width: '100%',
                  padding: '16px',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: '#262626',
                  color: 'white',
                }}
              ></textarea>
            </Final>
            <Checkbox
              checked={agreed}
              onChange={handleCheckboxChange}
              labelText="I have read and accepted the general terms and conditions."
            />
            <Pay>ORDER WITH COSTS</Pay>
          </Shopping>
        </Page>
      )}
    </Main>
  );
};

export default Cart;
