import Image from 'next/image';
import styled from 'styled-components';
const Page = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media screen and (max-width: 1120px) {
    grid-template-rows: 1fr 1fr;
    grid-template-columns: none;
  }
`;
const Pic = styled.div`
  width: 100%;
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

const Certifications = ({ dictionary }: { dictionary: any }) => {
  return (
    <Page>
      <Pic>
        <Image src={'/assets/diamonds/cert.png'} alt="diamond" layout="fill" objectFit="cover" />
      </Pic>
      <Text>
        <Title>{dictionary.title}</Title>
        <Head>{dictionary.heading}</Head>
        <Parag>{dictionary.paragraph1}</Parag>
        <Parag>{dictionary.paragraph2}</Parag>
        <Pictures>
          <Image src={'/assets/diamonds/Certs.png'} alt="gift1" layout="fill" objectFit="contain" />
        </Pictures>
      </Text>
    </Page>
  );
};

export default Certifications;
