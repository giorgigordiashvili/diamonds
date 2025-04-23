'use client';
import React, { useState } from 'react';
import Dualslider from './Slider';
import styled from 'styled-components';
import Image from 'next/image';
import DiamondsPicker from './DiamondsPicker';
import ClarityDropwown from './Claruty';
import ColorDropdown from './Color';
import Fluorescence from './Fluorescence';
import Certificate from './Certificate';
import Professional from './Proffesionall';

const Filters = styled.div`
  width: 400px;
  height: auto;
`;

const Filter = styled.div`
  height: 60px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 15px;
  line-height: 20px;
  letter-spacing: 0.2px;
  cursor: pointer;
  &:last-of-type {
    border-bottom: 2px solid rgba(81, 81, 81, 1);
  }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 15px;
  line-height: 20px;
  letter-spacing: 0.2px;
`;

const Arrow = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'rotated',
})<{ rotated: boolean }>`
  transform: ${({ rotated }) => (rotated ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s ease;
`;
const Resetbutton = styled.div`
  font-weight: 500;
  font-size: 12.91px;
  line-height: 14px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  color: white;
  width: 394px;
  height: 30px;
  padding: 8px 140px;
  border: 2px solid white;
  margin-top: 20px;
`;

const DiamondsSection = () => {
  const [showPicker, setShowPicker] = useState(true);
  const [showCarat, setShowCarat] = useState(true);
  const [showCut, setShowCut] = useState(false);
  const [showPolish, setShowPolish] = useState(false);
  const [showSymmetry, setShowSymmetry] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [showClarity, setShowClarity] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showFluorescence, setShowFluorescence] = useState(false);
  const [showCertrificate, setShowCertrificate] = useState(false);
  const [showProf, setShowProf] = useState(false);

  return (
    <>
      <Filters>
        {/* Shape Filter */}
        <Filter onClick={() => setShowPicker((prev) => !prev)}>
          <Title>Diamond shape</Title>
          <Arrow rotated={showPicker}>
            <Image
              src={`/assets/diamonds/arrow-drop-down-big-svgrepo-com.png`}
              alt="dropdown"
              width={20}
              height={20}
            />
          </Arrow>
        </Filter>
        {showPicker && <DiamondsPicker />}
        {/* carat Filter */}
        <Filter onClick={() => setShowCarat((prev) => !prev)}>
          <Title>Carat</Title>
          <Arrow rotated={showCarat}>
            <Image
              src={`/assets/diamonds/arrow-drop-down-big-svgrepo-com.png`}
              alt="dropdown"
              width={20}
              height={20}
            />
          </Arrow>
        </Filter>
        {showCarat && <Dualslider type="solid" solidMax={15} />}
        {/* color Filter */}
        <Filter onClick={() => setShowColor((prev) => !prev)}>
          <Title>Color</Title>
          <Arrow rotated={showColor}>
            <Image
              src={`/assets/diamonds/arrow-drop-down-big-svgrepo-com.png`}
              alt="dropdown"
              width={20}
              height={20}
            />
          </Arrow>
        </Filter>
        {showColor && <ColorDropdown />}
        {/* clarity Filter */}
        <Filter onClick={() => setShowClarity((prev) => !prev)}>
          <Title>Carat</Title>
          <Arrow rotated={showClarity}>
            <Image
              src={`/assets/diamonds/arrow-drop-down-big-svgrepo-com.png`}
              alt="dropdown"
              width={20}
              height={20}
            />
          </Arrow>
        </Filter>
        {showClarity && <ClarityDropwown />}
        {/* Cut Filter */}
        <Filter onClick={() => setShowCut((prev) => !prev)}>
          <Title>Cut</Title>
          <Arrow rotated={showCut}>
            <Image
              src={`/assets/diamonds/arrow-drop-down-big-svgrepo-com.png`}
              alt="dropdown"
              width={20}
              height={20}
            />
          </Arrow>
        </Filter>
        {showCut && <Dualslider type="dashed" />}
        {/* Polish Filter */}
        <Filter onClick={() => setShowPolish((prev) => !prev)}>
          <Title>Polish</Title>
          <Arrow rotated={showPolish}>
            <Image
              src={`/assets/diamonds/arrow-drop-down-big-svgrepo-com.png`}
              alt="dropdown"
              width={20}
              height={20}
            />
          </Arrow>
        </Filter>
        {showPolish && <Dualslider type="dashed" />}
        {/* Symmetry Filter */}
        <Filter onClick={() => setShowSymmetry((prev) => !prev)}>
          <Title>Symmetry</Title>
          <Arrow rotated={showSymmetry}>
            <Image
              src={`/assets/diamonds/arrow-drop-down-big-svgrepo-com.png`}
              alt="dropdown"
              width={20}
              height={20}
            />
          </Arrow>
        </Filter>
        {showSymmetry && <Dualslider type="dashed" />}
        {/* Fluorescence Filter */}
        <Filter onClick={() => setShowFluorescence((prev) => !prev)}>
          <Title>Fluorescence</Title>
          <Arrow rotated={showFluorescence}>
            <Image
              src={`/assets/diamonds/arrow-drop-down-big-svgrepo-com.png`}
              alt="dropdown"
              width={20}
              height={20}
            />
          </Arrow>
        </Filter>
        {showFluorescence && <Fluorescence />}
        {/* certificate Filter */}
        <Filter onClick={() => setShowCertrificate((prev) => !prev)}>
          <Title>Certificate</Title>
          <Arrow rotated={showCertrificate}>
            <Image
              src={`/assets/diamonds/arrow-drop-down-big-svgrepo-com.png`}
              alt="dropdown"
              width={20}
              height={20}
            />
          </Arrow>
        </Filter>
        {showCertrificate && <Certificate />}
        {/* price Filter */}
        <Filter onClick={() => setShowPrice((prev) => !prev)}>
          <Title>Price</Title>
          <Arrow rotated={showPrice}>
            <Image
              src={`/assets/diamonds/arrow-drop-down-big-svgrepo-com.png`}
              alt="dropdown"
              width={20}
              height={20}
            />
          </Arrow>
        </Filter>
        {showPrice && <Dualslider type="solid" solidMax={1000000} />}
        {/* proof Filter */}

        <Filter onClick={() => setShowProf((prev) => !prev)}>
          <Title>Professional</Title>
          <Arrow rotated={showProf}>+</Arrow>
        </Filter>
        {showProf && <Professional />}
      </Filters>
      <Resetbutton> Reset all filters</Resetbutton>
    </>
  );
};

export default DiamondsSection;
