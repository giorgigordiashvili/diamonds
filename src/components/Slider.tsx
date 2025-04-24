'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  color: white;
  font-family: sans-serif;
`;

const Section = styled.div``;

const Inputs = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1c1c1c;
  padding: 1rem;
`;

const NumberBox = styled.input`
  width: 100%;
  text-align: center;
  padding: 0.5rem;
  font-size: 1rem;
  background-color: transparent;
  color: white;
  border: none;
  border-bottom: 2px solid white;
  margin: 0 1rem;
`;

const Unit = styled.span`
  color: #999;
  margin-left: 0.5rem;
`;

const RangeWrapper = styled.div`
  position: relative;
  height: 32px;
  display: flex;
  align-items: center;
`;

const StyledSlider = styled.input<{ dashed?: string }>`
  position: absolute;
  width: 100%;
  height: 4px;
  appearance: none;
  background: ${({ dashed }) =>
    dashed === 'true'
      ? 'repeating-linear-gradient(to right, #fff, #fff 128px, transparent 4px, transparent 136px)'
      : '#fff'};
  border-radius: 2px;
  z-index: 1;
  pointer-events: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    z-index: 3;
    position: relative;
    pointer-events: auto;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    z-index: 3;
    position: relative;
    pointer-events: auto;
  }
`;

const Desc = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

const Descp = styled.p`
  text-align: center;
`;

type Props = {
  type: 'solid' | 'dashed';
  solidMin?: number;
  solidMax?: number;
};

const DualSlider: React.FC<Props> = ({ type, solidMin = 0, solidMax = 500 }) => {
  const [solidMinVal, setSolidMinVal] = useState(solidMin);
  const [solidMaxVal, setSolidMaxVal] = useState(solidMax);

  const [dashedMinVal, setDashedMinVal] = useState(1);
  const [dashedMaxVal, setDashedMaxVal] = useState(4);

  const labels = ['Medium', 'Good', 'Very Good', 'Excellent'];
  const pickedLabels = labels.slice(dashedMinVal - 1, dashedMaxVal);

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const handleSolidMinChange = (val: number) => {
    const clamped = clamp(val, solidMin, solidMaxVal);
    setSolidMinVal(clamped);
    if (clamped > solidMaxVal) setSolidMaxVal(clamped);
  };

  const handleSolidMaxChange = (val: number) => {
    const clamped = clamp(val, solidMinVal, solidMax);
    setSolidMaxVal(clamped);
    if (clamped < solidMinVal) setSolidMinVal(clamped);
  };

  const handleDashedMinChange = (val: number) => {
    const clamped = clamp(val, 1, dashedMaxVal);
    setDashedMinVal(clamped);
    if (clamped > dashedMaxVal) setDashedMaxVal(clamped);
  };

  const handleDashedMaxChange = (val: number) => {
    const clamped = clamp(val, dashedMinVal, 4);
    setDashedMaxVal(clamped);
    if (clamped < dashedMinVal) setDashedMinVal(clamped);
  };

  useEffect(() => {
    if (type === 'solid') {
      console.log(`Picked range: ${solidMinVal} - ${solidMaxVal}`);
    }
  }, [type, solidMinVal, solidMaxVal]);

  useEffect(() => {
    if (type === 'dashed') {
      console.log(`Picked labels: ${pickedLabels.join(', ')}`);
    }
  }, [type, pickedLabels, dashedMinVal, dashedMaxVal]);

  return (
    <Container>
      {type === 'solid' && (
        <Section>
          <Inputs>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <NumberBox
                type="number"
                value={solidMinVal}
                onChange={(e) => handleSolidMinChange(parseFloat(e.target.value))}
              />
              <Unit>Min</Unit>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <NumberBox
                type="number"
                value={solidMaxVal}
                onChange={(e) => handleSolidMaxChange(parseFloat(e.target.value))}
              />
              <Unit>Max</Unit>
            </div>
          </Inputs>
          <RangeWrapper>
            <StyledSlider
              type="range"
              min={solidMin}
              max={solidMax}
              value={solidMinVal}
              onChange={(e) => handleSolidMinChange(parseFloat(e.target.value))}
            />
            <StyledSlider
              type="range"
              min={solidMin}
              max={solidMax}
              value={solidMaxVal}
              onChange={(e) => handleSolidMaxChange(parseFloat(e.target.value))}
            />
          </RangeWrapper>
        </Section>
      )}

      {type === 'dashed' && (
        <Section>
          <RangeWrapper>
            <StyledSlider
              type="range"
              min={1}
              max={4}
              value={dashedMinVal}
              dashed={dashedMinVal ? 'true' : 'false'}
              onChange={(e) => handleDashedMinChange(parseFloat(e.target.value))}
            />
            <StyledSlider
              type="range"
              min={1}
              max={4}
              value={dashedMaxVal}
              dashed={dashedMaxVal ? 'true' : 'false'}
              onChange={(e) => handleDashedMaxChange(parseFloat(e.target.value))}
            />
          </RangeWrapper>
          <Desc>
            {labels.map((label, i) => (
              <Descp key={i}>{label}</Descp>
            ))}
          </Desc>
        </Section>
      )}
    </Container>
  );
};

export default DualSlider;
