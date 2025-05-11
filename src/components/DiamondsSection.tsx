'use client';
import { diamondsApi } from '@/api';
import { getDictionary } from '@/get-dictionary';
import { Shape } from '@/types/diamond';
import Image from 'next/image';
import React, { useState } from 'react';
import styled from 'styled-components';
import Certificate from './Certificate';
import ClarityDropwown from './Claruty';
import ColorDropdown from './Color';
import CutDropdown from './Cut';
import DiamondsPicker from './DiamondsPicker';
import Fluorescence from './Fluorescence';
import Professional from './Proffesionall';
import Dualslider from './Slider';

const Main = styled.div`
  width: 100%;
  max-width: 400px;
  height: auto;
  @media screen and (max-width: 980px) {
    max-width: unset;
  }
`;
const Filters = styled.div`
  @media screen and (max-width: 460px) {
    width: 100%;
  }
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
  color: rgb(255, 255, 255);
  width: 100%;
  height: fit-content;
  padding: 8px 0px;
  border: 2px solid white;
  margin-top: 20px;
  @media screen and (max-width: 460px) {
    height: fit-content;
  }
`;
const ShowButton = styled.div`
  display: none;
  font-weight: 500;
  font-size: 12.91px;
  line-height: 14px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  color: black;
  width: 100%;
  height: fit-content;
  padding: 8px 0px;
  border: 2px solid white;
  margin-top: 20px;
  background-color: white;

  @media screen and (max-width: 980px) {
    display: block;
  }
`;

interface DiamondsSectionProps {
  onFilterChange: (filterName: string, value: any) => void;
  currentFilters: Partial<
    diamondsApi.DiamondSearchParams & {
      clarityMin?: string;
      clarityMax?: string;
      cutMin?: string;
      cutMax?: string;
    }
  >;
  dictionary: Awaited<ReturnType<typeof getDictionary>>['diamondsSection'];
}

const DiamondsSection: React.FC<DiamondsSectionProps> = ({
  onFilterChange,
  currentFilters,
  dictionary,
}) => {
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

  const handleShapeChange = (shape: Shape | undefined) => {
    onFilterChange('shape', shape);
  };

  const handleCaratRangeChange = (min: number, max: number) => {
    onFilterChange('caratMin', min);
    onFilterChange('caratMax', max);
  };

  const handleClarityChange = (min: string | undefined, max: string | undefined) => {
    onFilterChange('clarityMin', min);
    onFilterChange('clarityMax', max);
  };

  const handleColorChange = (min: string | undefined, max: string | undefined) => {
    onFilterChange('colorMin', min);
    onFilterChange('colorMax', max);
  };

  const handleCutChange = (min: string | undefined, max: string | undefined) => {
    onFilterChange('cutMin', min);
    onFilterChange('cutMax', max);
  };

  return (
    <Main>
      <Filters>
        {/* Shape Filter */}
        <Filter onClick={() => setShowPicker((prev) => !prev)}>
          <Title>{dictionary.shapesTitle}</Title>
          <Arrow rotated={showPicker}>
            <Image
              src={`/assets/diamonds/arrow-drop-down-big-svgrepo-com.png`}
              alt="dropdown"
              width={20}
              height={20}
            />
          </Arrow>
        </Filter>
        {showPicker && (
          <DiamondsPicker
            onShapeChange={handleShapeChange}
            selectedShape={currentFilters.shape as Shape}
          />
        )}
        {/* carat Filter */}
        <Filter onClick={() => setShowCarat((prev) => !prev)}>
          <Title>{dictionary.caratRange}</Title>
          <Arrow rotated={showCarat}>
            <Image
              src={`/assets/diamonds/arrow-drop-down-big-svgrepo-com.png`}
              alt="dropdown"
              width={20}
              height={20}
            />
          </Arrow>
        </Filter>
        {showCarat && (
          <Dualslider
            type="solid"
            solidMax={15} // Assuming 15 is the absolute max for carat selection
            initialMin={currentFilters.caratMin}
            initialMax={currentFilters.caratMax}
            onRangeChange={handleCaratRangeChange}
          />
        )}
        {/* color Filter */}
        <Filter onClick={() => setShowColor((prev) => !prev)}>
          <Title>{dictionary.colorsTitle}</Title>
          <Arrow rotated={showColor}>
            <Image
              src={`/assets/diamonds/arrow-drop-down-big-svgrepo-com.png`}
              alt="dropdown"
              width={20}
              height={20}
            />
          </Arrow>
        </Filter>
        {showColor && (
          <ColorDropdown
            onColorChange={handleColorChange}
            initialMin={currentFilters.colorMin}
            initialMax={currentFilters.colorMax}
          />
        )}
        {/* clarity Filter */}
        <Filter onClick={() => setShowClarity((prev) => !prev)}>
          <Title>{dictionary.clarityTitle}</Title>
          <Arrow rotated={showClarity}>
            <Image
              src={`/assets/diamonds/arrow-drop-down-big-svgrepo-com.png`}
              alt="dropdown"
              width={20}
              height={20}
            />
          </Arrow>
        </Filter>
        {showClarity && (
          <ClarityDropwown
            onClarityChange={handleClarityChange}
            initialMin={currentFilters.clarityMin}
            initialMax={currentFilters.clarityMax}
          />
        )}
        {/* Cut Filter */}
        <Filter onClick={() => setShowCut((prev) => !prev)}>
          <Title>{dictionary.cutTitle}</Title>
          <Arrow rotated={showCut}>
            <Image
              src={`/assets/diamonds/arrow-drop-down-big-svgrepo-com.png`}
              alt="dropdown"
              width={20}
              height={20}
            />
          </Arrow>
        </Filter>
        {showCut && (
          <CutDropdown
            onCutChange={handleCutChange}
            initialMin={currentFilters.cutMin}
            initialMax={currentFilters.cutMax}
          />
        )}
        {/* Polish Filter */}
        <Filter onClick={() => setShowPolish((prev) => !prev)}>
          <Title>{dictionary.polishTitle}</Title>
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
          <Title>{dictionary.symmetryTitle}</Title>
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
          <Title>{dictionary.fluorescenceTitle}</Title>
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
          <Title>{dictionary.certificatesTitle}</Title>
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
          <Title>{dictionary.priceRange}</Title>
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
          <Title>{dictionary.professionalTitle}</Title>
          <Arrow rotated={showProf}>+</Arrow>
        </Filter>
        {showProf && <Professional />}
      </Filters>
      <ShowButton> {dictionary.showResultsButton}</ShowButton>

      <Resetbutton> {dictionary.resetFiltersButton}</Resetbutton>
    </Main>
  );
};

export default DiamondsSection;
