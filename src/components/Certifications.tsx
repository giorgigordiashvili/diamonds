import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
const Page = styled.div`
  margin-top: 280px;
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  @media screen and (max-width: 1120px) {
    margin-top: 48px;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: none;
  }
`;
const Pic = styled.div`
  width: 720px;
  height: 750px;
  position: relative;
  @media screen and (max-width: 1120px) {
    width: 100%;
    height: 100%;
    grid-row: 1;
  }
`;
const Text = styled.div`
  padding: 64px 72px;
  background-color: rgba(38, 38, 38, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media screen and (max-width: 1120px) {
    align-items: center;
    padding: 48px 16px;
    gap: 16px;
  }
`;
const Title = styled.div`
  width: fit-content;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 13.34px;
  line-height: 12px;
  letter-spacing: 1.4px;
  vertical-align: middle;
  border-bottom: 2px solid white;
  border-top: 2px solid white;
`;
const Head = styled.div`
  font-weight: 300;
  font-size: 36.88px;
  line-height: 48px;
  letter-spacing: 0.2px;
  vertical-align: middle;
  @media screen and (max-width: 1120px) {
    text-align: center;
  }
`;
const Parag = styled.div`
  font-weight: 400;
  font-size: 14.63px;
  line-height: 24px;
  letter-spacing: 0.2px;
  vertical-align: middle;
  @media screen and (max-width: 1120px) {
    text-align: center;
  }
`;
const Pictures = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  height: 82px;
  position: relative;
`;

const Certifications = () => {
  return (
    <Page>
      <Pic>
        <Image src={'/assets/diamonds/cert.png'} alt="diamond" layout="fill" objectFit="cover" />
      </Pic>
      <Text>
        <Title>Quality promise</Title>
        <Head>Your advantages with Brogle</Head>
        <Parag>
          When selecting our gemstones, we place particular emphasis on quality criteria that go
          beyond the classic 4Cs, as well as on the essential certification already from 0.3ct. All
          our investment diamonds have a certificate from one of the worlds leading laboratories GIA
          (Gemological Institute of America), IGI (International Institute of Gemology) or HRD
          (Hooge Raad voor Diamant). Which one is right for you individually, we determine in the
          personal consultation.
        </Parag>
        <Parag>
          Your advantages at Brogle Through the certificate you not only have a confirmation of the
          authenticity and value of the diamond - only with a certificate that shows the quality of
          the diamond, you achieve a reasonable price when reselling. All offered stones are also
          pre-selected by us, so that you can rely on their quality and investability. If you wish,
          we can also offer you regular cleaning free of charge.
        </Parag>
        <Pictures>
          <Image src={'/assets/diamonds/Certs.png'} alt="gift1" layout="fill" objectFit="contain" />
        </Pictures>
      </Text>
    </Page>
  );
};

export default Certifications;
