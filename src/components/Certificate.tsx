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

const Certificte = () => {
  const handleClick = (text: string) => {
    console.log(text);
  };

  return (
    <Box>
      <Item onClick={() => handleClick('GIA')}>GIA</Item>
      <Item onClick={() => handleClick('IGI')}>IGI</Item>
      <Item onClick={() => handleClick('HDR')}>HDR</Item>
    </Box>
  );
};

export default Certificte;
