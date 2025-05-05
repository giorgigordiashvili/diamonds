'use client';
import React from 'react';
import styled from 'styled-components';
import Links from '@/components/Links';
import UniqueGift from '@/components/UniqueGift';
import DiamondQuality from '@/components/DiamondQuality';
import Certifications from '@/components/Certifications';

const Sec1 = styled.div``;
const Main = styled.div`
  margin-top: 52px;
`;
const Desc = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 1086px;
`;
const Left = styled.div``;
const Right = styled.div`
  background-color: rgba(38, 38, 38, 1);
`;

const Order = () => {
  return (
    <Main>
      <Sec1></Sec1>
      <Links></Links>
      <Desc>
        <Left></Left>
        <Right></Right>
      </Desc>
      <UniqueGift></UniqueGift>
      <DiamondQuality></DiamondQuality>
      <Certifications></Certifications>
    </Main>
  );
};

export default Order;
