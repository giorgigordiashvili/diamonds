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
    align-content: center;
    background-color: #262626;
    padding: 12px;
  }

  :nth-child(3) {
    grid-column: span 2;
  }
  :nth-child(4) {
    grid-column: span 2;
  }
  :nth-child(5) {
    grid-column: span 2;
  }
  :nth-child(6) {
    grid-column: span 4;
  }
  @media screen and (max-width: 460px) {
    display: flex;
    flex-direction: column;
  }
`;
const Title = styled.div``;

const Data = () => {
  const [agreed, setAgreed] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreed(e.target.checked);
  };
  return (
    <Main>
      <Head>
        <div></div>
        <p>Your data</p>
        <div></div>
      </Head>
      <Form>
        <Title>Title</Title>
        <input type="text" name="title" id="title" placeholder="Title" />
        <input type="text" name="company" id="company" placeholder="Company (optional)" />
        <input type="text" name="name" id="name" placeholder="First name *" />
        <input type="text" name="lastname" id="lastname" placeholder="Last name *" />
        <input type="email" name="email" id="email" placeholder="Your email address *" />
      </Form>
      <Checkbox
        checked={agreed}
        onChange={handleCheckboxChange}
        labelText="Create a customer account."
      ></Checkbox>
    </Main>
  );
};

export default Data;
