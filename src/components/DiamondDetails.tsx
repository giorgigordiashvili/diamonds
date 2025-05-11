'use client';
import * as diamondsApi from '@/api/diamonds';
import DiamondFilter from '@/components/DiamondFilter';
import Links from '@/components/Links';
import { useCart } from '@/context/CartContext'; // Import useCart
import { Diamond } from '@/types/diamond';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Certifications from './Certifications';
import DiamondQuality from './DiamondQuality';
import UniqueGift from './UniqueGift';

const Main = styled.div`
  margin-top: 52px;
`;
const Desc = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 1086px;
  @media screen and (max-width: 1120px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    height: fit-content;
  }
  @media screen and (max-width: 800px) {
    padding-inline: 16px;

    height: fit-content;
  }
`;
const Left = styled.div`
  padding: 124px 140px 130px 130px;

  @media screen and (max-width: 800px) {
    padding: 80px 16px;
  }
`;
const Right = styled.div`
  background-color: rgba(38, 38, 38, 1);
  padding-top: 120px;
  padding-inline: 140px;
  @media screen and (max-width: 800px) {
    padding-inline: 16px;
  }
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
  @media screen and (max-width: 1120px) {
    padding-inline: 16px;
  }
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
  cursor: pointer;
`;
const Page = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media screen and (max-width: 1120px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
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
  width: 100%;
  margin-top: 36px;
  display: flex;
  gap: 32px;
  margin-bottom: 16px;
  @media screen and (max-width: 650px) {
    display: grid;
    grid-template-rows: auto auto;
    margin-top: 16px;
    margin-bottom: 16px;
    gap: 16px;
    width: 100%;
  }
`;
const Smalls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media screen and (max-width: 650px) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    grid-row: 2;
    gap: 32px;
  }
`;
const Mainpic = styled.div`
  height: 514px;
  width: 100%;
  position: relative;
  @media screen and (max-width: 650px) {
    width: 100%;
  }
`;

const Purchase = styled.div`
  margin-top: 48px;
  P:first-of-type {
    font-weight: 400;
    font-size: 10.88px;
    line-height: 24px;
    letter-spacing: 0%;
  }
  @media screen and (max-width: 1120px) {
    width: 100%;
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
    width: 100%;
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
  @media screen and (max-width: 1120px) {
    grid-template-columns: 1fr;
  }
`;

const Buttons = styled.button`
  background: linear-gradient(180deg, #c60000 0%, #840101 100%);
  height: 40px;
  text-align: center;
  border-radius: 10px;
  align-content: center;
  font-weight: 700;
  font-size: 11.44px;
  line-height: 18px;
  letter-spacing: 0.56px;
  color: white;
  border: none;
  cursor: pointer;
  width: 100%;
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
  justify-content: space-around;
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
    @media screen and (max-width: 490px) {
      align-items: baseline;
      flex-direction: column;
    }
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

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 20px;
`;

const LoadingMessage = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
`;

interface DiamondDetailsProps {
  id: string;
  lang: string;
  dictionary: any;
}

const DiamondDetails: React.FC<DiamondDetailsProps> = ({ id, lang, dictionary }) => {
  const router = useRouter();
  const [diamond, setDiamond] = useState<Diamond | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart(); // Get addToCart from context

  useEffect(() => {
    if (id && dictionary) {
      setLoading(true);
      diamondsApi
        .getDiamond(id)
        .then((data: Diamond) => {
          setDiamond(data);
          if (data.image) {
            setSelectedImage(data.image);
          }
          setError(null);
        })
        .catch((err: Error) => {
          console.error('Failed to fetch diamond:', err);
          setError(dictionary?.diamondDetail?.fetchError || 'Failed to load diamond details.');
          setDiamond(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (!dictionary) {
      setLoading(true);
    }
  }, [id, dictionary]);

  const handleAddToCart = async () => {
    if (diamond) {
      try {
        addToCart(diamond); // Use context function
        alert(dictionary?.diamondDetail?.addedToCartSuccess || 'Diamond added to cart!');
      } catch (err) {
        console.error('Failed to add to cart:', err);
        alert(dictionary?.diamondDetail?.addedToCartError || 'Failed to add diamond to cart.');
      }
    }
  };

  if (loading) {
    return (
      <LoadingMessage>
        {dictionary?.diamondDetail?.loading || 'Loading diamond details...'}
      </LoadingMessage>
    );
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!diamond) {
    return (
      <ErrorMessage>{dictionary?.diamondDetail?.notFound || 'Diamond not found.'}</ErrorMessage>
    );
  }

  const diamondName = lang === 'ka' && diamond.name_ka ? diamond.name_ka : diamond.name_en;
  const galleryImages = diamond.image
    ? [diamond.image, '/assets/order/sample.png', '/assets/order/sample.png']
    : ['/assets/order/sample.png', '/assets/order/sample.png', '/assets/order/sample.png'];

  return (
    <Main>
      <Sec1>
        <Back onClick={() => router.back()}>
          <p>&#10094;</p>
          <p>{dictionary?.diamondDetail?.backToOverview || 'BACK TO THE OVERVIEW'}</p>
        </Back>
        <Page>
          <Pics>
            <Headtitle>
              <p>{`${diamond.shape}, ${diamond.carat} Carat, ${diamond.color}, ${diamond.clarity}, ${diamond.cut}`}</p>
              <p>
                {dictionary?.diamondDetail?.certifiedBy ||
                  'Certified by the independent testing institute'}{' '}
                {diamond.certificate}
              </p>
            </Headtitle>
            <Diamondpics>
              <Smalls>
                {galleryImages.slice(0, 2).map((imgSrc, index) => (
                  <Image
                    key={index}
                    src={imgSrc || '/assets/diamonds/Diamant.png'}
                    width={75}
                    height={75}
                    alt={`${diamondName} gallery image ${index + 1}`}
                    style={{ objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                    onClick={() => setSelectedImage(imgSrc)}
                  />
                ))}
              </Smalls>
              <Mainpic>
                <Image
                  src={selectedImage || diamond.image || '/assets/diamonds/Diamant.png'}
                  fill
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                  alt={`${diamondName} main image`}
                  priority
                />
              </Mainpic>
            </Diamondpics>
          </Pics>
          <Buy>
            <Image src={'/assets/order/secondlogo.png'} width={235} height={45} alt="logo"></Image>
            <Purchase>
              <p>
                {dictionary?.diamondDetail?.itemNo || 'Item no.'} {diamond.id}
              </p>
              <Blank>
                <Top>
                  <p>{dictionary?.diamondDetail?.available || 'available'}</p>
                  <div>
                    <p>
                      {diamond.price.toLocaleString(lang === 'ka' ? 'ka-GE' : 'en-US', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </p>
                    <p>{dictionary?.diamondDetail?.broglePrice || 'Brogle price'}</p>
                  </div>
                  <p>{dictionary?.diamondDetail?.vatShipping || 'incl. VAT & Shipping'}</p>
                </Top>
                <Middle>
                  <div>
                    <p>{dictionary?.diamondDetail?.shape || 'Shape:'}</p>
                    <p>{diamond.shape}</p>
                  </div>
                  <div>
                    <p>{dictionary?.diamondDetail?.carat || 'Carat:'}</p>
                    <p>{diamond.carat.toFixed(2)}</p>
                  </div>
                  <div>
                    <p>{dictionary?.diamondDetail?.color || 'Color:'}</p>
                    <p>{diamond.color}</p>
                  </div>
                  <div>
                    <p>{dictionary?.diamondDetail?.clarity || 'Clarity:'}</p>
                    <p>{diamond.clarity}</p>
                  </div>
                  <div>
                    <p>{dictionary?.diamondDetail?.cut || 'Cut:'}</p>
                    <p>{diamond.cut}</p>
                  </div>
                  <div>
                    <p>{dictionary?.diamondDetail?.polish || 'Polish:'}</p>
                    <p>{diamond.polish}</p>
                  </div>
                  <div>
                    <p>{dictionary?.diamondDetail?.symmetry || 'Symmetry:'}</p>
                    <p>{diamond.symmetry}</p>
                  </div>
                  <div>
                    <p>{dictionary?.diamondDetail?.fluorescence || 'Fluorescence:'}</p>
                    <p>{diamond.fluorescence}</p>
                  </div>
                  <div>
                    <p>{dictionary?.diamondDetail?.certificate || 'Certificate:'}</p>
                    <p>{diamond.certificate}</p>
                  </div>
                  {diamond.certificateNumber && (
                    <div>
                      <p>{dictionary?.diamondDetail?.certificateNo || 'Certificate No.:'}</p>
                      <p>{diamond.certificateNumber}</p>
                    </div>
                  )}
                </Middle>
                <Bottom>
                  <Buttons onClick={handleAddToCart}>
                    {dictionary?.diamondDetail?.addToCart || 'ADD TO CART'}
                  </Buttons>
                  <Info>
                    <Assistant>
                      <div>
                        <p>
                          {dictionary?.diamondDetail?.shoppingAssistant ||
                            'Personal Shopping Assistant'}{' '}
                        </p>
                        <p>+49 711 217 268 20</p>
                      </div>
                      <p>
                        {dictionary?.diamondDetail?.expertAdvice ||
                          'Let our diamond expert Julian Barzen advise you.'}
                      </p>
                    </Assistant>
                    <Image src={'/assets/header/man.png'} width={70} height={70} alt="man"></Image>
                  </Info>
                </Bottom>
              </Blank>
            </Purchase>
          </Buy>
        </Page>
      </Sec1>
      <Links dictionary={dictionary.links}></Links>
      <Desc>
        <Left>
          <Lefthead>
            <p>{dictionary?.diamondDetail?.shareProduct || 'Share product:'} </p>
            <div>
              <Image
                width={24}
                height={24}
                alt="social facebook"
                src={'/assets/order/fb.png'}
              ></Image>
              <Image
                width={24}
                height={24}
                alt="social twitter"
                src={'/assets/order/tw.png'}
              ></Image>
              <Image
                width={24}
                height={24}
                alt="social pinterest"
                src={'/assets/order/pn.png'}
              ></Image>
              <Image width={24} height={24} alt="social mail" src={'/assets/order/ml.png'}></Image>
            </div>
          </Lefthead>
          <Leftbody>
            <p>{dictionary?.diamondDetail?.detailsTitle || 'Details of the diamond'}</p>
            <List>
              <div>
                <p>{dictionary?.diamondDetail?.itemNoTable || 'Item number'}</p>
                <p>{diamond.id}</p>
              </div>
              <div>
                <p>{dictionary?.diamondDetail?.shapeTable || 'Shape'}</p>
                <p>{diamond.shape}</p>
              </div>
              <div>
                <p>{dictionary?.diamondDetail?.caratTable || 'Carat'}</p>
                <p>{diamond.carat.toFixed(2)}</p>
              </div>
              <div>
                <p>{dictionary?.diamondDetail?.colorTable || 'Color'}</p>
                <p>{diamond.color}</p>
              </div>
              <div>
                <p>{dictionary?.diamondDetail?.clarityTable || 'Clarity'}</p>
                <p>{diamond.clarity}</p>
              </div>
              <div>
                <p>{dictionary?.diamondDetail?.cutTable || 'Cut'}</p>
                <p>{diamond.cut}</p>
              </div>
              <div>
                <p>{dictionary?.diamondDetail?.polishTable || 'Polish'}</p>
                <p>{diamond.polish}</p>
              </div>
              <div>
                <p>{dictionary?.diamondDetail?.symmetryTable || 'Symmetry'}</p>
                <p>{diamond.symmetry}</p>
              </div>
              <div>
                <p>{dictionary?.diamondDetail?.fluorescenceTable || 'Fluorescence'}</p>
                <p>{diamond.fluorescence}</p>
              </div>
              <div>
                <p>{dictionary?.diamondDetail?.certificateTable || 'Certificate'}</p>
                <p>{diamond.certificate}</p>
              </div>
              {diamond.certificateNumber && (
                <div>
                  <p>{dictionary?.diamondDetail?.certificateNoTable || 'Certificate No.'}</p>
                  <p>{diamond.certificateNumber}</p>
                </div>
              )}
            </List>
          </Leftbody>
        </Left>
        <Right>
          {diamond && (
            <DiamondFilter
              dictionary={dictionary}
              activeValues={{
                Color: diamond.color,
                Clarity: diamond.clarity,
                Cut: diamond.cut,
                Polish: diamond.polish,
                Symmetry: diamond.symmetry,
                Fluorescence: diamond.fluorescence,
              }}
            />
          )}
        </Right>
      </Desc>
      <UniqueGift dictionary={dictionary.pageContent.uniqueGift}></UniqueGift>
      <DiamondQuality dictionary={dictionary.pageContent.diamondQuality}></DiamondQuality>
      <Certifications dictionary={dictionary.pageContent.certifications}></Certifications>
    </Main>
  );
};

export default DiamondDetails;
