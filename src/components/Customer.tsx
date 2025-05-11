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
const Form = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: center;
  input {
    background-color: #262626;
    width: 100%;
    outline: none;
    border: none;
    padding: 12px;
  }
  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Login = styled.div`
  background-color: white;
  border-radius: 5px;
  color: black;
  height: 40px;
  padding-inline: 32px;
  font-size: 16px;
  font-weight: 700;
  align-content: center;
  text-align: center;
`;
const Password = styled.div`
  width: fit-content;
  margin-bottom: 20px;
  border-bottom: 1px solid #a8a8a8;
  padding-bottom: 2px;
  color: #a8a8a8;
  font-size: 14px;
`;
const Customer = () => {
  return (
    <Main>
      <Head>
        <div></div>
        <p>Register as a customer</p>
        <div></div>
      </Head>
      <Form>
        <input type="email" name="email" id="email" placeholder="Your email address" />
        <input type="password" name="password" id="password" placeholder="Your password" />

        <Login>LOG IN</Login>
      </Form>
      <Password>Forgotten password</Password>
    </Main>
  );
};

export default Customer;
