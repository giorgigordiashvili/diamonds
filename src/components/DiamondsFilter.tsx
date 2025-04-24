'use client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DiamondsSection from './DiamondsSection';

const Head = styled.div`
  margin-bottom: 30px;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  @media screen and (max-width: 460px) {
    margin-inline: 16px;
    text-align: center;
    border: 2px solid rgba(255, 255, 255, 1);
    height: 44px;
    align-content: center;
    font-size: 14px;
  }
`;
const DiamondsFilter = () => {
  const [showFilter, setShowFilter] = useState(true);
  useEffect(() => {
    if (window.innerWidth <= 1000) {
      setShowFilter(false);
    }
  }, []);

  return (
    <>
      <Head onClick={() => setShowFilter((prev) => !prev)}>Configure diamond</Head>
      {showFilter && <DiamondsSection />}
    </>
  );
};

export default DiamondsFilter;
