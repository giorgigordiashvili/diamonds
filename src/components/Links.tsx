import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

const Main = styled.div`
  flex-wrap: wrap;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 16px;
  row-gap: 20px;

  background-color: rgba(26, 26, 26, 1);
  @media screen and (max-width: 1360px) {
    flex-wrap: wrap;
    height: auto;
    gap: 20px;
    padding-inline: 20px;
    @media screen and (max-width: 588px) {
      justify-content: left;
      width: fit-content;
    }
  }
`;
const Box = styled.div`
  display: flex;
  gap: 17px;
  padding-inline: 8px;
  @media screen and (max-width: 795px) {
    width: 100%;
  }
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

interface LinksProps {
  dictionary: any;
}

const Links: React.FC<LinksProps> = ({ dictionary }) => {
  return (
    <Main>
      <Box>
        <Image src={'/assets/order/nature.png'} width={70} height={70} alt="photo"></Image>
        <Texts>
          <Thead>{dictionary.natureDiamondsTitle || 'nature diamonds'}</Thead>
          <Tsmall>{dictionary.natureDiamondsSubtitle || 'natural diamonds only'}</Tsmall>
        </Texts>
      </Box>
      <Box>
        <Image src={'/assets/order/certificate.png'} width={70} height={70} alt="photo"></Image>
        <Texts>
          <Thead>{dictionary.certificatesTitle || 'Certificates'}</Thead>
          <Tsmall>
            {dictionary.certificatesSubtitle || 'independent institutes (GIA, IGI, HRD)'}
          </Tsmall>
        </Texts>
      </Box>
      <Box>
        <Image src={'/assets/order/diamond.png'} width={70} height={70} alt="photo"></Image>
        <Texts>
          <Thead>{dictionary.conflictFreeTitle || '100%'}</Thead>
          <Tsmall>{dictionary.conflictFreeSubtitle || 'conflict-free diamonds'}</Tsmall>
        </Texts>
      </Box>
      <Box>
        <Image src={'/assets/order/price.png'} width={70} height={70} alt="photo"></Image>
        <Texts>
          <Thead>{dictionary.bestPriceTitle || 'Best Price Guarantee'}</Thead>
          <Tsmall>{dictionary.bestPriceSubtitle || 'with Brogle Diamonds'}</Tsmall>
        </Texts>
      </Box>
      <Box>
        <Image src={'/assets/order/since.png'} width={70} height={70} alt="photo"></Image>
        <Texts>
          <Thead>{dictionary.since1945Title || 'Since 1945'}</Thead>
          <Tsmall>{dictionary.since1945Subtitle || 'Experience and quality'}</Tsmall>
        </Texts>
      </Box>
    </Main>
  );
};

export default Links;
