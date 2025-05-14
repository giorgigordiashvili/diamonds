'use client';
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import AddressAndOrders from './AddressAndOrders';
const Main = styled.div`
  padding-inline: 40px;
  margin-top: 56px;
  color: white;
  background-color: black;
  display: flex;
  justify-content: space-around;
  @media screen and (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Container = styled.div`
  padding: 40px;
  width: 100%;
  @media screen and (max-width: 900px) {
    padding-inline: 0;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 24px;
`;

const AddButton = styled.button`
  background-color: white;
  color: black;
  border: none;
  padding: 10px 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 40px;
`;

const AddressWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 40px;
`;

const AddressCard = styled.div<{ isDefault?: boolean }>`
  flex: 1;
  border: 1px solid #515151;
  padding: 24px;
  width: 300px;
  background-color: ${({ isDefault }) => (isDefault ? '#000' : 'transparent')};
`;

const AddressTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 16px;
`;

const AddressText = styled.p`
  margin: 0;
  margin-bottom: 8px;
  font-size: 14px;
`;

const Section = styled.div`
  padding: 40px 32px;
  margin-top: 40px;
  border: 1px solid #515151;
`;

const EditableCard = styled.div`
  background-color: #1a1a1a;
  padding: 24px;
  width: 300px;
`;

const EditButton = styled.button`
  background: none;
  border: 1px solid white;
  color: white;
  padding: 8px 12px;
  font-weight: bold;
  margin-top: 16px;
  cursor: pointer;
`;

const Address = () => {
  return (
    <Main>
      <AddressAndOrders></AddressAndOrders>
      <Container>
        <Title>My Addresses</Title>
        <Link href="/newaddress">
          <AddButton>Add new address</AddButton>
        </Link>

        <AddressWrapper>
          <AddressCard isDefault>
            <AddressTitle>Default billing address</AddressTitle>
            <AddressText>Mrs. mariami kilasonia</AddressText>
            <AddressText>tbilisi</AddressText>
            <AddressText>13123 tbilisi</AddressText>
            <AddressText>Germany</AddressText>
            <AddressText>487542987</AddressText>
          </AddressCard>

          <AddressCard>
            <AddressText>Mrs. mariami kilasonia</AddressText>
            <AddressText>tbilisi</AddressText>
            <AddressText>13123 tbilisi</AddressText>
            <AddressText>Germany</AddressText>
            <AddressText>487542987</AddressText>
          </AddressCard>
        </AddressWrapper>

        <Section>
          <AddressTitle>Available addresses</AddressTitle>
          <EditableCard>
            <AddressText>Mrs. mariami kilasonia</AddressText>
            <AddressText>tbilisi</AddressText>
            <AddressText>13123 tbilisi</AddressText>
            <AddressText>Germany</AddressText>
            <AddressText>487542987</AddressText>
            <EditButton>Edit address</EditButton>
          </EditableCard>
        </Section>
      </Container>
    </Main>
  );
};

export default Address;
