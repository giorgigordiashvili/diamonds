'use client';
import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const Styledhead = styled.div`
  width: 100%;
  height: 52px;
  justify-content: space-between;
  display: flex;
  align-items: center;
  padding-inline: 48px;
  background-color: rgba(242, 242, 241, 1);
  @media screen and (max-width: 1267px) {
    padding-inline: 0px;
  }
  @media screen and (max-width: 1171px) {
    padding-inline: 24px;
  }
  @media screen and (max-width: 820px) {
    justify-content: center;
  }
  @media screen and (max-width: 710px) {
    height: 64px;
  }
`;
const Tabs = styled.div`
  display: flex;
  align-items: center;
  margin-left: 26px;
  margin-right: auto;
  @media screen and (max-width: 1171px) {
    display: none;
  }
`;
const Tab = styled.div`
  padding-inline: 24px;
  font-weight: 600;
  font-size: 14;
  line-height: 16px;
  color: rgba(125, 125, 125, 1);
`;
const Contact = styled.div`
  width: fit-content;
  display: flex;
  gap: 8px;
  align-items: center;
  color: rgba(8, 8, 8, 1);
  font-weight: 700;
  font-size: 12;
  line-height: 16px;
  @media screen and (max-width: 460px) {
    font-size: 12px;
    width: 100%;
  }
`;
const Tel = styled.p``;
const Int = styled.p`
  @media screen and (max-width: 710px) {
    display: none;
  }
`;
const Request = styled.div`
  min-width: 160px;
  border: 2px solid black;
  text-align: center;
  line-height: 21px;
  padding: 4px 24px;
  margin-left: 36px;
  @media screen and (max-width: 1303px) {
    margin-left: 0px;
  }
  @media screen and (max-width: 460px) {
    margin-left: auto;
    height: 44px;
    align-content: center;
  }
`;
const Left = styled.div`
  display: flex;
  width: fit-content;
  @media screen and (max-width: 820px) {
    display: none;
  }
`;
const Logo = styled.div`
  display: block;
  @media screen and (max-width: 820px) {
    display: none;
  }
`;
const Logosmall = styled.div`
  display: none;
  @media screen and (max-width: 820px) {
    display: block;
  }
`;

const Header = () => {
  return (
    <Styledhead>
      <Left>
        <Image src={'/assets/header/logo.png'} height={22} width={115} alt="logo"></Image>

        <Tabs>
          <Tab>Diamonds</Tab>
          <Tab>Certificates</Tab>
          <Tab>Request</Tab>
        </Tabs>
      </Left>
      <Contact>
        <Logo>
          <Image src={'/assets/header/man.png'} alt="profile" width={40} height={40}></Image>
        </Logo>
        <Logosmall>
          <Image src={'/assets/header/man.png'} alt="profile" width={30} height={30}></Image>
        </Logosmall>
        <Int>Personal counselling interview: </Int>
        <Tel>+49 (0) 711 217 268 20</Tel>
        <Request>Individual request</Request>
      </Contact>
    </Styledhead>
  );
};

export default Header;
