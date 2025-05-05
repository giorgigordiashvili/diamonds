import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const Main = styled.div`
  width: 100%;
  height: 210px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(26, 26, 26, 1);
`;
const Box = styled.div`
  display: flex;
  gap: 17px;
  padding-inline: 8px;
`;
const Texts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
const Thead = styled.div`
  font-weight: 700;
  font-size: 22.13px;
  line-height: 26px;
  letter-spacing: -0.3px;
`;
const Tsmall = styled.div`
  font-family: Inter;
  font-weight: 300;
  font-size: 12.91px;
  line-height: 20px;
  letter-spacing: 0%;
  color: rgba(255, 255, 255, 1);
`;

const Links = () => {
  return (
    <Main>
      <Box>
        <Image src={'/assets/order/nature.png'} width={70} height={70} alt="photo"></Image>
        <Texts>
          <Thead>nature diamonds</Thead>
          <Tsmall>natural diamonds only</Tsmall>
        </Texts>
      </Box>
      <Box>
        <Image src={'/assets/order/certificate.png'} width={70} height={70} alt="photo"></Image>
        <Texts>
          <Thead>Certificates</Thead>
          <Tsmall>independent institutes (GIA, IGI, HRD)</Tsmall>
        </Texts>
      </Box>
      <Box>
        <Image src={'/assets/order/diamond.png'} width={70} height={70} alt="photo"></Image>
        <Texts>
          <Thead>100%</Thead>
          <Tsmall>conflict-free diamonds</Tsmall>
        </Texts>
      </Box>
      <Box>
        <Image src={'/assets/order/price.png'} width={70} height={70} alt="photo"></Image>
        <Texts>
          <Thead>Best Price Guarantee</Thead>
          <Tsmall>with Brogle Diamonds</Tsmall>
        </Texts>
      </Box>
      <Box>
        <Image src={'/assets/order/since.png'} width={70} height={70} alt="photo"></Image>
        <Texts>
          <Thead>Since 1945</Thead>
          <Tsmall>Experience and quality</Tsmall>
        </Texts>
      </Box>
    </Main>
  );
};

export default Links;
