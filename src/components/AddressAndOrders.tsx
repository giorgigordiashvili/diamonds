'use client';
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Left = styled.div`
  padding: 0 16px;
  min-width: 200px;
  margin-top: 84px;

  @media screen and (max-width: 900px) {
    width: 100%;
    border: none;
    padding: 0;
  }
`;

const StyledLink = styled(Link)<{ $active: boolean }>`
  display: block;
  padding: 10px 4px;
  width: 100%;
  font-weight: 700;
  font-size: 16px;
  color: white;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  text-decoration: none;

  @media screen and (max-width: 900px) {
    display: none;
  }
`;

const Logout = styled.p`
  margin-top: 20px;
  padding-inline: 32px;
  width: fit-content;
  border: 2px solid white;
  cursor: pointer;

  @media screen and (max-width: 900px) {
    display: none;
  }
`;

const Dropdown = styled.select`
  display: none;

  @media screen and (max-width: 900px) {
    display: block;
    width: 100%;
    padding: 12px;
    background-color: black;
    color: white;
    font-weight: bold;
    font-size: 16px;
    border: 1px solid white;
  }
`;

const AddressAndOrders = () => {
  const pathname = usePathname();
  const router = useRouter();

  const currentPage = pathname.endsWith('/orders')
    ? 'orders'
    : pathname.endsWith('/address') || pathname.endsWith('/newaddress')
      ? 'address'
      : '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/${e.target.value}`);
  };

  return (
    <Left>
      <Dropdown value={currentPage} onChange={handleChange}>
        <option value="address">My addresses</option>
        <option value="orders">Orders</option>
        <option value="logout">Log out</option>
      </Dropdown>

      <StyledLink href="/address" $active={currentPage === 'address'}>
        My addresses
      </StyledLink>

      <StyledLink href="/orders" $active={currentPage === 'orders'}>
        Orders
      </StyledLink>

      <Logout>Log Out</Logout>
    </Left>
  );
};

export default AddressAndOrders;
