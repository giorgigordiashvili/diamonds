'use client';
import React from 'react';
import styled from 'styled-components';
import AddressAndOrders from './AddressAndOrders';
const Main = styled.div`
  padding-inline: 40px;
  height: 100dvh;
  margin-top: 56px;
  color: white;
  background-color: black;
  display: flex;
  justify-content: space-around;
  @media screen and (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    justify-content: start;
  }
`;

const Container = styled.div`
  padding: 40px;
  width: 100%;
  @media screen and (max-width: 900px) {
    padding-inline: 0;
    max-width: unset;
    width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 24px;
`;

const BackLink = styled.a`
  color: white;
  text-decoration: underline;
  cursor: pointer;
  display: inline-block;
  margin-bottom: 32px;
`;

const Orders = () => {
  return (
    <Main>
      <AddressAndOrders></AddressAndOrders>

      <Container>
        <BackLink href="/address">&lt; Back to the overview</BackLink>
        <Title>My Orders</Title>
      </Container>
    </Main>
  );
};

export default Orders;
