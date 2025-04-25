import React from 'react';
import styled from 'styled-components';
import SortingDropdown from './SortingDropdown';
import Image from 'next/image';
import Scroll from './Scroll';

const Page = styled.div`
  width: 100%;
`;
const Head = styled.div`
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 980px) {
    margin-top: 24px;
  }
  @media screen and (max-width: 465px) {
    display: block;
  }
`;
const Title = styled.div`
  font-weight: 300;
  font-size: 18.59px;
  line-height: 32px;
  letter-spacing: 0.4px;
`;

const Line = styled.div`
  display: flex;
  gap: 8px;
  font-weight: 700;
  font-size: 12.69px;
  line-height: 32px;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  @media screen and (max-width: 465px) {
    display: block;

    text-align: left;
  }
`;
const Sort1 = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
`;
const Item = styled.div`
  width: 100%;
  padding-left: 8px;
  padding-bottom: 12px;
  padding-top: 16px;
  display: flex;
  gap: 12px;
  border-bottom: 1px solid white;
  justify-content: space-between;
  @media screen and (max-width: 755px) {
    justify-content: start;
  }
`;
const Desc = styled.div``;
const Description = styled.div`
  max-width: 294px;
  display: flex;
  gap: 116px;
  align-items: center;
  p:first-child {
    color: rgba(168, 168, 168, 1);
    font-weight: 600;
    line-height: 12px;
    letter-spacing: 0%;
  }
  @media screen and (max-width: 755px) {
    gap: 28px;
    width: auto;
    font-size: 10px;
  }
`;
const Card = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  @media screen and (max-width: 755px) {
    width: 48px;
    height: 48px;
  }
`;
const Texts = styled.div`
  display: flex;
  width: 100%;
  gap: 48px;
`;

const DiamondsList = () => {
  return (
    <Page>
      <Head>
        <Title>19,005 Diamonds</Title>
        <Line>
          <Sort1>
            <p>view:</p>
            <Image src={'/assets/diamonds/Component 1grid.png'} alt="view" width={16} height={16} />
            <Image src={'/assets/diamonds/line.png'} alt="view" width={16} height={16} />
          </Sort1>
          <SortingDropdown></SortingDropdown>
        </Line>
      </Head>
      <List>
        <Item>
          <Card>
            <Image
              src={'/assets/diamonds/Diamant.png'}
              alt="diamond"
              fill
              style={{ objectFit: 'contain' }}
            />
          </Card>
          <Texts>
            <Desc>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
            </Desc>
            <Desc>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
            </Desc>
          </Texts>
        </Item>
        <Item>
          <Card>
            <Image
              src={'/assets/diamonds/Diamant.png'}
              alt="diamond"
              fill
              style={{ objectFit: 'contain' }}
            />
          </Card>
          <Texts>
            <Desc>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
            </Desc>
            <Desc>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
            </Desc>
          </Texts>
        </Item>
        <Item>
          <Card>
            <Image
              src={'/assets/diamonds/Diamant.png'}
              alt="diamond"
              fill
              style={{ objectFit: 'contain' }}
            />
          </Card>
          <Texts>
            <Desc>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
            </Desc>
            <Desc>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
              <Description>
                <p>Shape:</p>
                <p>Emerald</p>
              </Description>
            </Desc>
          </Texts>
        </Item>
      </List>
      <Scroll></Scroll>
    </Page>
  );
};

export default DiamondsList;
