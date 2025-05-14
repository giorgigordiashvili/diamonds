'use client';
import React from 'react';
import styled from 'styled-components';
import AddressAndOrders from './AddressAndOrders';
const Main = styled.div`
  margin-top: 56px;
  color: white;
  background-color: black;
  display: flex;
  padding-inline: 40px;
  gap: 80px;
  @media screen and (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
`;

const Container = styled.div`
  max-width: 500px;
  background-color: black;
  color: white;
  padding: 40px;
  font-family: Arial, sans-serif;
  min-height: 100vh;
  @media screen and (max-width: 900px) {
    padding-inline: 0;
    max-width: unset;
    width: 100%;
  }
`;

const BackLink = styled.a`
  color: white;
  text-decoration: underline;
  cursor: pointer;
  display: inline-block;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 32px;
`;

const Form = styled.form`
  display: grid;
  gap: 16px;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  background-color: #1f1f1f;
  border: none;
  padding: 12px;
  color: white;
  flex: 1;
`;

const Select = styled.select`
  background-color: #1f1f1f;
  border: none;
  padding: 12px;
  color: white;
  flex: 1;
`;

const Button = styled.button`
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 12px 24px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 24px;
`;

const Note = styled.p`
  font-size: 12px;
  margin-top: 8px;
`;

const NewAddress = () => {
  return (
    <Main>
      <AddressAndOrders></AddressAndOrders>
      <Container>
        <BackLink href="/address">&lt; Back to the overview</BackLink>
        <Title>New address</Title>

        <Form>
          <Row>
            <Select required>
              <option value="">Title *</option>
              <option value="mr">Mr.</option>
              <option value="mrs">Mrs.</option>
            </Select>
            <Input placeholder="Title" />
            <Input placeholder="Company (optional)" />
          </Row>

          <Row>
            <Input placeholder="First name *" required />
            <Input placeholder="Last name *" required />
          </Row>

          <Input placeholder="Street and Housenumber *" required />

          <Row>
            <Input placeholder="Postal code" />
            <Input placeholder="City" />
          </Row>

          <Row>
            <Select required>
              <option value="">Country *</option>
              <option value="Germany">Germany</option>
              <option value="Georgia">Georgia</option>
            </Select>
            <Input placeholder="Phone number" />
          </Row>

          <Button type="submit">Save address</Button>
          <Note>*Compulsory fields</Note>
        </Form>
      </Container>
    </Main>
  );
};

export default NewAddress;
