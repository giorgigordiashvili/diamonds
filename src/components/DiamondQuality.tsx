import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

const Title = styled.div`
  padding: 60px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Small = styled.div`
  font-weight: 600;
  font-size: 11.25px;
  line-height: 12px;
  letter-spacing: 1.4px;
  text-align: center;
  vertical-align: middle;
  text-transform: uppercase;
`;

const Big = styled.div`
  font-weight: 300;
  font-size: 44.25px;
  line-height: 52px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  @media screen and (max-width: 1120px) {
    font-size: 25px;
  }
`;

const Pic = styled.div`
  position: relative;
  width: 100%;
  height: 750px;
  object-fit: contain;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  text-align: center;
  width: 100%;
  margin-bottom: 140px;
  @media screen and (max-width: 1120px) {
    padding-inline: 65px;
    margin-bottom: 12px;
  }

  p {
    font-weight: 300;
    font-size: 18.28px;
    line-height: 32px;
    letter-spacing: 0.4px;
    text-align: center;
    vertical-align: middle;

    margin-inline: auto;
    max-width: 600px;
  }
`;
const Span = styled.span`
  color: rgba(255, 255, 255, 1);
  font-weight: 700;
`;

const DiamondQuality = () => {
  return (
    <>
      <Title>
        <Small>QUALITY FEATURES</Small>
        <Big>Evaluate diamond quality</Big>
      </Title>
      <Pic>
        <Image src={'/assets/diamonds/Quality.png'} alt="" layout="fill" objectFit="cover" />
      </Pic>
      <Text>
        <p>
          If you want to buy diamonds, it is important that you can determine the quality of your
          investment or diamond jewelry. You can do this if you know what aspects to look for. The
          most common classification takes place according to the so-
        </p>
        <p>
          called <Span>4Cs</Span> which we explain in detail in our guide. In addition, there are
          other important criteria, such as the fifth C, the<Span> indispensable certificate</Span>,
          as well as, for example, the indicators<Span> Ground finish</Span> for diamonds, which
          <Span>Symmetry</Span>,
        </p>
        <p>
          <Span>Polish </Span>and <Span>Fluorescence</Span>. Investment diamonds should also always
          be untreated. Here it quickly becomes clear: A diamond as an investment must necessarily
          meet other criteria than a pure jewelry stone.
        </p>
      </Text>
    </>
  );
};

export default DiamondQuality;
