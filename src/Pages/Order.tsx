'use client';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import Links from '@/components/Links';
import UniqueGift from '@/components/UniqueGift';
import DiamondQuality from '@/components/DiamondQuality';
import Certifications from '@/components/Certifications';

const Main = styled.div`
  margin-top: 52px;
`;
const Desc = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 1086px;
`;
const Left = styled.div`
  padding: 124px 140px 0 130px;
`;
const Right = styled.div`
  background-color: rgba(38, 38, 38, 1);
`;
const Lefthead = styled.div`
  display: flex;
  border-bottom: 1px solid white;
  gap: 12px;
  padding-left: 32px;
  padding-bottom: 36px;
  align-items: center;

  div {
    display: flex;
    gap: 24px;
  }
  p {
    font-weight: 600;
    font-size: 15.25px;
    line-height: 16px;
    letter-spacing: 0%;
  }
`;
const Leftbody = styled.div`
  margin-top: 34px;
  padding-left: 32px;
  border-bottom: 1px solid white;

  p {
    font-weight: 600;
    font-size: 18.44px;
    line-height: 22px;
    letter-spacing: 0%;
    padding-left: 8px;
  }
`;
const List = styled.div`
  margin-top: 36px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding-bottom: 24px;
  gap: 24px;

  p:first-of-type {
    color: rgba(125, 125, 125, 1);
    font-weight: 700;
    font-size: 11.63px;
    line-height: 12px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    padding-bottom: 4px;
    padding-left: 0;
  }
  p:last-of-type {
    font-weight: 600;
    font-size: 14.25px;
    line-height: 17px;
    letter-spacing: 0%;
    color: rgba(255, 255, 255, 1);
    padding-left: 0;
  }
`;
const Sec1 = styled.div`
  padding-top: 32px;
  padding-bottom: 76px;
  width: 100%;
  margin-inline: auto;
  padding-inline: 32px;
`;

const Back = styled.div`
  padding-left: 8px;
  display: flex;
  font-weight: 700;
  font-size: 11.44px;
  line-height: 12px;
  letter-spacing: 0.6px;
  gap: 8px;
  width: fit-content;
`;
const Page = styled.div`
  margin-top: 20px;

  display: grid;
  grid-template-columns: 1fr 1fr;
`;
const Headtitle = styled.div`
  p:first-of-type {
    font-weight: 600;
    font-size: 21.2px;
    line-height: 27px;
    letter-spacing: 0.6px;
    text-align: center;
  }
  p:last-of-type {
    font-family: Inter;
    font-weight: 400;
    font-style: italic;
    font-size: 12.09px;
    line-height: 24px;
    letter-spacing: 0%;
    text-align: center;
    color: rgba(168, 168, 168, 1);
  }
`;

const Pics = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Buy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Diamondpics = styled.div`
  margin-top: 36px;
  display: flex;
  gap: 32px;
`;
const Smalls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Mainpic = styled.div``;
const Purchase = styled.div`
  margin-top: 48px;
  P:first-of-type {
    font-weight: 400;
    font-size: 10.88px;
    line-height: 24px;
    letter-spacing: 0%;
  }
`;
const Blank = styled.div`
  border-radius: 20px;
  background-color: rgba(38, 38, 38, 1);
  padding: 24px 0;
`;
const Top = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 20px 0;
  p:first-of-type {
    background-color: rgba(97, 197, 50, 1);
    color: rgba(38, 38, 38, 1);
    font-weight: 700;
    font-size: 11.06px;
    line-height: 15px;
    letter-spacing: 0%;
    text-align: center;
    width: fit-content;
    padding: 0 4px;
    margin-bottom: 24px;
  }
  div p:first-of-type {
    background-color: unset;
    color: unset;
    font-weight: 600;
    font-size: 23.44px;
    line-height: 25px;
    letter-spacing: 0%;
    text-align: center;
    margin-bottom: 4px;
  }
  p:last-of-type {
    font-weight: 300;
    font-size: 11.25px;
    line-height: 18px;
    letter-spacing: 0%;
    text-align: center;
  }
  div p:last-child {
    font-weight: 400;
    font-style: italic;
    font-size: 10.31px;
    line-height: 14.3px;
    letter-spacing: 0%;
    text-align: center;
    margin-bottom: 12px;
  }
`;
const Middle = styled.div`
  background-color: rgba(58, 58, 58, 1);
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 20px;
  div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 224px;
    justify-content: space-between;
  }
  div p:first-of-type {
    font-weight: 700;
    font-size: 12.91px;
    line-height: 16px;
    letter-spacing: 0%;
  }
  div p:last-of-type {
    font-family: Inter;
    font-weight: 300;
    font-size: 12.8px;
    line-height: 16px;
    letter-spacing: 0%;
  }
`;

const Buttons = styled.div`
  background: linear-gradient(180deg, #c60000 0%, #840101 100%);
  height: 40px;
  text-align: center;
  border-radius: 10px;
  align-content: center;
  font-weight: 700;
  font-size: 11.44px;
  line-height: 18px;
  letter-spacing: 0.56px;
  text-align: center;
  vertical-align: middle;
`;
const Bottom = styled.div`
  padding-inline: 24px;
  padding-top: 16px;
`;
const Info = styled.div`
  border-top: 1px solid white;
  padding-top: 20px;
  margin-top: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Assistant = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: 400;
  font-size: 11.06px;
  line-height: 24px;
  letter-spacing: 0%;

  div {
    display: flex;
  }
  div p:first-child {
    font-weight: 700;
    font-size: 13.02px;
    line-height: 24px;
    letter-spacing: 0%;
  }
  div p:last-child {
    font-weight: 500;
    font-size: 16.31px;
    line-height: 18px;
    letter-spacing: 0%;
    text-align: center;
    vertical-align: middle;
  }
`;

const Order = () => {
  return (
    <Main>
      <Sec1>
        <Back>
          <p>&#10094;</p>
          <p> BACK TO THE OVERVIEW</p>
        </Back>
        <Page>
          <Pics>
            <Headtitle>
              <p>Brilliant, 0.51 Carat, E, SI1, Good</p>
              <p>Certified by the independent testing institute GIA </p>
            </Headtitle>
            <Diamondpics>
              <Smalls>
                <Image
                  src={'/assets/order/sample.png'}
                  width={75}
                  height={75}
                  alt="mainpic of diamond"
                ></Image>
                <Image
                  src={'/assets/order/sample.png'}
                  width={75}
                  height={75}
                  alt="mainpic of diamond"
                ></Image>
              </Smalls>
              <Mainpic>
                <Image
                  src={'/assets/order/sample.png'}
                  width={514}
                  height={514}
                  alt="mainpic of diamond"
                ></Image>
              </Mainpic>
            </Diamondpics>
          </Pics>
          <Buy>
            <Image src={'/assets/order/secondlogo.png'} width={235} height={45} alt="logo"></Image>
            <Purchase>
              <p>Item no. 169174848</p>
              <Blank>
                <Top>
                  <p>avalible</p>
                  <div>
                    <p>679,00 €</p>
                    <p>Brogle price</p>
                  </div>
                  <p>incl. VAT & Shipping</p>
                </Top>
                <Middle>
                  <div>
                    <p>Shape:</p>
                    <p>Brilliant</p>
                  </div>
                  <div>
                    <p>Shape:</p>
                    <p>Brilliant</p>
                  </div>
                  <div>
                    <p>Shape:</p>
                    <p>Brilliant</p>
                  </div>
                  <div>
                    <p>Shape:</p>
                    <p>Brilliant</p>
                  </div>
                  <div>
                    <p>Shape:</p>
                    <p>Brilliant</p>
                  </div>
                  <div>
                    <p>Shape:</p>
                    <p>uahdwuwhadw</p>
                  </div>
                  <div>
                    <p>Shape:</p>
                    <p>Brilliant</p>
                  </div>
                </Middle>
                <Bottom>
                  <Buttons>ADD TO CART</Buttons>
                  <Info>
                    <Assistant>
                      <div>
                        <p>Personal Shopping Assistant </p>
                        <p>+49 711 217 268 20</p>
                      </div>
                      <p>Let our diamond expert Julian Barzen advise you.</p>
                    </Assistant>

                    <Image src={'/assets/header/man.png'} width={70} height={70} alt="man"></Image>
                  </Info>
                </Bottom>
              </Blank>
            </Purchase>
          </Buy>
        </Page>
      </Sec1>
      <Links></Links>
      <Desc>
        <Left>
          <Lefthead>
            <p>Share product: </p>
            <div>
              <Image width={24} height={24} alt="social" src={'/assets/order/fb.png'}></Image>
              <Image width={24} height={24} alt="social" src={'/assets/order/tw.png'}></Image>
              <Image width={24} height={24} alt="social" src={'/assets/order/pn.png'}></Image>
              <Image width={24} height={24} alt="social" src={'/assets/order/ml.png'}></Image>
            </div>
          </Lefthead>
          <Leftbody>
            <p>Details of the diamond</p>
            <List>
              <div>
                <p>Item number</p>
                <p>169174848</p>
              </div>
              <div>
                <p>Item number</p>
                <p>169174848</p>
              </div>{' '}
              <div>
                <p>Item number</p>
                <p>169174848</p>
              </div>{' '}
              <div>
                <p>Item number</p>
                <p>169174848</p>
              </div>{' '}
              <div>
                <p>Item number</p>
                <p>169174848</p>
              </div>{' '}
              <div>
                <p>Item number</p>
                <p>169174848</p>
              </div>{' '}
              <div>
                <p>Item number</p>
                <p>169174848</p>
              </div>{' '}
              <div>
                <p>Item number</p>
                <p>169174848</p>
              </div>{' '}
              <div>
                <p>Item number</p>
                <p>169174848</p>
              </div>{' '}
              <div>
                <p>Item number</p>
                <p>169174848</p>
              </div>{' '}
              <div>
                <p>Item number</p>
                <p>169174848</p>
              </div>{' '}
              <div>
                <p>Item number</p>
                <p>169174848</p>
              </div>{' '}
              <div>
                <p>Item number</p>
                <p>169174848</p>
              </div>{' '}
              <div>
                <p>Item number</p>
                <p>169174848</p>
              </div>
            </List>
          </Leftbody>
        </Left>
        <Right></Right>
      </Desc>
      <UniqueGift></UniqueGift>
      <DiamondQuality></DiamondQuality>
      <Certifications></Certifications>
    </Main>
  );
};

export default Order;
