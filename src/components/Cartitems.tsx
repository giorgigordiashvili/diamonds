'use client';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import Checkbox from './Checkbox';

const Main = styled.div`
  width: 100%;
  height: fit-content;
  padding: 20px 36px;
  border: 1px solid #7d7d7d;
`;

const Head = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  text-align: center;
  align-items: center;
  gap: 16px;

  div {
    background-color: white;
    height: 2px;
  }

  p {
    font-size: 18px;
    font-weight: 600;
  }
`;

const Diamond = styled.div`
  padding-bottom: 12px;
  border-bottom: 1px solid white;

  &:last-of-type {
    border-bottom: unset;
  }
`;

const Item = styled.div`
  display: flex;
  width: 100%;
  padding: 20px 12px;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
`;

const Desc = styled.div`
  margin-inline: 32px;
`;

const Name = styled.div`
  font-weight: 300;
  font-size: 16px;
`;

const Description = styled.div`
  color: #a8a8a8;
  font-size: 12px;
`;

const Moreinfo = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 20px;
`;

const Quant = styled.div`
  font-size: 20px;
`;

const Price = styled.div``;

const Cost = styled.div`
  font-weight: bold;
  font-size: 12px;
`;

const Tax = styled.div`
  font-weight: bold;
  color: #a8a8a8;
  font-size: 10px;
`;

const Wrap = styled.div`
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 16px;
`;

const Wrapfee = styled.div`
  color: black;
  background-color: white;
  font-size: 12px;
  font-weight: bold;
  padding-inline: 4px;
`;

const Trashcan = styled.div`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const sampleDiamond = {
  id: crypto.randomUUID(),
  name: 'Brilliant, 0.59 Carat, G, SI1, Very good',
  description:
    'Shape: Brilliant, Carat: 0.59, Color: G, Clarity: SI1, Cut: Very good, Polish: Good Item number: 166974277',
  quantity: 1,
  cost: '1.378,00 €',
  checked: false,
};

const Cartitems = () => {
  const [diamonds, setDiamonds] = useState([
    sampleDiamond,
    { ...sampleDiamond, id: crypto.randomUUID() },
  ]);

  const handleDelete = (id: string) => {
    setDiamonds((prev) => prev.filter((d) => d.id !== id));
  };

  const handleCheck = (id: string, checked: boolean) => {
    setDiamonds((prev) => prev.map((d) => (d.id === id ? { ...d, checked } : d)));
    if (checked) {
      console.log(`Checkbox for diamond ${id} checked`);
    }
  };

  return (
    <Main>
      <Head>
        <div></div>
        <p>Your Shopping Cart</p>
        <div></div>
      </Head>

      {diamonds.map((diamond) => (
        <Diamond key={diamond.id}>
          <Item>
            <Image src="/assets/order/sample.png" alt="diamond" width={70} height={70} />
            <Desc>
              <Name>{diamond.name}</Name>
              <Description>{diamond.description}</Description>
              <Moreinfo>
                <Quant>{diamond.quantity}</Quant>
                <Price>
                  <Cost>{diamond.cost}</Cost>
                  <Tax>incl. VAT, free insured shipping</Tax>
                </Price>
              </Moreinfo>
            </Desc>
            <Trashcan onClick={() => handleDelete(diamond.id)}>
              <Trash style={{ maxWidth: '24px' }} color="white" size={16} />
            </Trashcan>
          </Item>

          <Wrap>
            <Checkbox
              checked={diamond.checked}
              onChange={(e) => handleCheck(diamond.id, e.target.checked)}
              labelText="Gift wrap"
            />
            <Wrapfee>Free of charge</Wrapfee>
          </Wrap>
        </Diamond>
      ))}
    </Main>
  );
};

export default Cartitems;
