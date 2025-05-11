'use client';
import React, { useState } from 'react';
import styled from 'styled-components';
import Checkbox from './Checkbox';

const Main = styled.div`
  width: 100%;
  height: fit-content;
  margin-bottom: 20px;
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
const Form = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  row-gap: 20px;
  column-gap: 8px;
  color: #d4d4d4;
  input {
    background-color: #262626;
    width: 100%;
    outline: none;
    border: none;
    padding: 12px;
  }
  :nth-child(1) {
    grid-column: span 4;
  }

  :nth-child(3) {
    grid-column: span 3;
  }
  :nth-child(4) {
    align-content: center;
    background-color: #262626;
    grid-column: span 2;
    padding: 12px;
  }
  :nth-child(5) {
    grid-column: span 2;
  }
  @media screen and (max-width: 460px) {
    display: flex;
    flex-direction: column;
  }
`;
const Title = styled.div``;
const Privacy = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  :nth-child(1) {
    font-size: 20px;
    font-weight: 600;
    line-height: 24px;
  }
  :nth-child(2) {
    color: rgb(168, 168, 168);
    font-size: 14px;
    letter-spacing: 0px;
    line-height: 20px;
  }
  :nth-child(3) {
    color: rgb(168, 168, 168);
    font-size: 12px;
    letter-spacing: 0.1px;
    line-height: 12px;
  }
`;

const Billing = () => {
  const [agreed, setAgreed] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreed(e.target.checked);
  };
  return (
    <Main>
      <Head>
        <div></div>
        <p>Billing address</p>
        <div></div>
      </Head>
      <Form>
        <input type="text" name="house" id="house" placeholder="Sreet and Housenumber " />
        <input type="number" name="postalcode" id="postalcode" placeholder="Postal code *" />
        <input type="text" name="city" id="city" placeholder="City *" />
        <Title>country *</Title>
        <input type="number" name="number" id="number" placeholder="Phoone number" />
      </Form>
      <Checkbox
        checked={agreed}
        onChange={handleCheckboxChange}
        labelText="Billing address differs from delivery address"
      ></Checkbox>
      <Privacy>
        <p>Privacy</p>
        <p>
          By selecting continue you confirm that you have read our data protection information and
          accepted our general terms and conditions.
        </p>
        <p>*Compulsory fields</p>
      </Privacy>
    </Main>
  );
};

export default Billing;
