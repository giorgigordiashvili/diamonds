'use client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DiamondsSection from './DiamondsSection';
import MobileFilter from './MobileFilter';

const Head = styled.div`
  margin-bottom: 30px;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  @media screen and (max-width: 980px) {
    margin-inline: 16px;
    text-align: center;
    border: 2px solid rgba(255, 255, 255, 1);
    height: 44px;
    align-content: center;
    font-size: 14px;
  }
`;

const DiamondsFilter = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 980);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div>
      <Head onClick={() => setShowFilter((prev) => !prev)}>Configure diamond</Head>

      {/* On desktop, show DiamondsSection by default */}
      {!isMobile && <DiamondsSection />}

      {/* On mobile, only show MobileFilter if showFilter is true */}
      {isMobile && showFilter && <MobileFilter onClose={() => setShowFilter(false)} />}
    </div>
  );
};

export default DiamondsFilter;
