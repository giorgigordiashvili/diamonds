'use client';
import { Shape } from '@/types/diamond'; // Assuming Shape type is exported from here
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
  width: 100%;
  display: grid;
  gap: 4px;
  grid-template-columns: 1fr 1fr;
`;

const Item = styled.div<{ isSelected: boolean }>`
  display: flex;
  width: 100%;
  height: 44px;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ isSelected }) =>
    isSelected ? 'rgba(80, 80, 80, 1)' : 'rgba(38, 38, 38, 1)'};
  padding-inline: 16px;
  cursor: pointer;
  border: 1px solid ${({ isSelected }) => (isSelected ? 'white' : 'transparent')}; // Example border for selection
  &:hover {
    background-color: ${({ isSelected }) =>
      isSelected ? 'rgba(80, 80, 80, 1)' : 'rgba(50, 50, 50, 1)'};
  }
`;

interface DiamondsPickerProps {
  onShapeChange: (shape: Shape | undefined) => void; // Allow undefined for unselecting
  selectedShape?: Shape;
}

const DiamondsPicker: React.FC<DiamondsPickerProps> = ({ onShapeChange, selectedShape }) => {
  const handleClick = (diamondName: Shape) => {
    if (diamondName === selectedShape) {
      onShapeChange(undefined); // Call with undefined to unselect
    } else {
      onShapeChange(diamondName);
    }
  };

  return (
    <Box>
      <Item onClick={() => handleClick('Brilliant')} isSelected={selectedShape === 'Brilliant'}>
        Brilliant{' '}
        <Image src={'/assets/diamonds/brilliant.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Pear')} isSelected={selectedShape === 'Pear'}>
        Pear <Image src={'/assets/diamonds/pearl.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Princess')} isSelected={selectedShape === 'Princess'}>
        Princess{' '}
        <Image src={'/assets/diamonds/princess.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Marquise')} isSelected={selectedShape === 'Marquise'}>
        Marquise{' '}
        <Image src={'/assets/diamonds/marquise.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Oval')} isSelected={selectedShape === 'Oval'}>
        Oval <Image src={'/assets/diamonds/oval.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Radiant')} isSelected={selectedShape === 'Radiant'}>
        Radiant <Image src={'/assets/diamonds/radiant.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Emerald')} isSelected={selectedShape === 'Emerald'}>
        Emerald <Image src={'/assets/diamonds/emerald.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Heart')} isSelected={selectedShape === 'Heart'}>
        Heart <Image src={'/assets/diamonds/heart.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Cushion')} isSelected={selectedShape === 'Cushion'}>
        Cushion <Image src={'/assets/diamonds/cushion.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Asscher')} isSelected={selectedShape === 'Asscher'}>
        Asscher <Image src={'/assets/diamonds/asscher.png'} alt="diamond" width={28} height={28} />
      </Item>
    </Box>
  );
};

export default DiamondsPicker;
