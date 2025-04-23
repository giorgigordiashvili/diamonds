'use client';
import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const Box = styled.div`
  width: 100%;
  display: grid;
  gap: 4px;
  grid-template-columns: 1fr 1fr;
`;

const Item = styled.div`
  display: flex;
  width: 100%;
  height: 44px;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(38, 38, 38, 1);
  padding-inline: 16px;
  cursor: pointer; /* Optional: adds a pointer cursor when hovering */
`;

const DiamondsPicker = () => {
  const handleClick = (diamondName: string) => {
    console.log(`Clicked on: ${diamondName}`);
  };

  return (
    <Box>
      <Item onClick={() => handleClick('Brilliant')}>
        Brilliant{' '}
        <Image src={'/assets/diamonds/brilliant.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Pear')}>
        Pear <Image src={'/assets/diamonds/pearl.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Princess')}>
        Princess{' '}
        <Image src={'/assets/diamonds/princess.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Marquise')}>
        Marquise{' '}
        <Image src={'/assets/diamonds/marquise.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Oval')}>
        Oval <Image src={'/assets/diamonds/oval.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Radiant')}>
        Radiant <Image src={'/assets/diamonds/radiant.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Emerald')}>
        Emerald <Image src={'/assets/diamonds/emerald.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Heart')}>
        Heart <Image src={'/assets/diamonds/heart.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Cushion')}>
        Cushion <Image src={'/assets/diamonds/cushion.png'} alt="diamond" width={28} height={28} />
      </Item>
      <Item onClick={() => handleClick('Asscher')}>
        Asscher <Image src={'/assets/diamonds/asscher.png'} alt="diamond" width={28} height={28} />
      </Item>
    </Box>
  );
};

export default DiamondsPicker;
