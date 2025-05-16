import Image from 'next/image';
import styled from 'styled-components';

const Title = styled.div`
  margin-top: 150px;
  margin-bottom: 52px;
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

const DiamondQuality = ({ dictionary }: { dictionary: any }) => {
  return (
    <>
      <Title>
        <Small>{dictionary.smallTitle}</Small>
        <Big>{dictionary.bigTitle}</Big>
      </Title>
      <Pic>
        <Image src={'/assets/diamonds/Quality.png'} alt="" layout="fill" objectFit="cover" />
      </Pic>
      <Text>
        <p>{dictionary.paragraph1}</p>
        <p>
          {dictionary.paragraph2Part1}
          <Span>{dictionary.fourCs}</Span>
          {dictionary.paragraph2Part2}
          <Span>{dictionary.indispensableCertificate}</Span>
          {dictionary.paragraph2Part3}
          <Span>{dictionary.groundFinish}</Span>
          {dictionary.paragraph2Part4}
          <Span>{dictionary.symmetry}</Span>
          {dictionary.paragraph2Part5}
        </p>
        <p>
          <Span>{dictionary.polish}</Span>
          {dictionary.paragraph3Part1}
          <Span>{dictionary.fluorescence}</Span>
          {dictionary.paragraph3Part2}
        </p>
      </Text>
    </>
  );
};

export default DiamondQuality;
