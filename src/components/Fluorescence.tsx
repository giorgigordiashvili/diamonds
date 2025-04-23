import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
  width: 100%;
  display: grid;
  gap: 4px;
  grid-template-columns: 132px 132px;
`;

const Item = styled.div`
  display: flex;
  width: 100%;
  height: 44px;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(38, 38, 38, 1);
  padding-inline: 16px;
  cursor: pointer;
`;

const Fluorescence = () => {
  const handleClick = (text: string) => {
    console.log(text);
  };

  return (
    <Box>
      <Item onClick={() => handleClick('None')}>None</Item>
      <Item onClick={() => handleClick('Very slight')}>Very slight</Item>
      <Item onClick={() => handleClick('Slight')}>Slight</Item>
      <Item onClick={() => handleClick('Faint')}>Faint</Item>
      <Item onClick={() => handleClick('Medeium')}>Medeium</Item>
      <Item onClick={() => handleClick('Strong')}>Strong</Item>
      <Item onClick={() => handleClick('Very Strong')}>Very Strong</Item>
    </Box>
  );
};

export default Fluorescence;
