import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  color: white;
  width: 100%;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 22px;
  letter-spacing: 0%;
  margin-bottom: 20px;
`;

const OptionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: 25px;
  position: relative;
  gap: 4px;
  flex-wrap: wrap;
  row-gap: 16px;
`;

const OptionWrapper = styled.div`
  flex: 1;
  text-align: center;
  position: relative;
`;

const Arrow = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: white;
`;

const Underline = styled.div`
  height: 2px;
  background-color: none;
  width: 100%;
  margin-top: 4px;
`;

const Option = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 1.4px;
  text-align: center;
  text-transform: uppercase;

  color: ${(props) => (props.active ? 'white' : '#666')};
  border-top: 2px solid ${(props) => (props.active ? 'white' : '#888')};
  padding: 8px;
  border-radius: 2px;
`;

const SectionComponent = ({ title, options, activeValue }) => {
  return (
    <Section>
      <Title>{title}</Title>
      <OptionsRow>
        {options.map((opt) => (
          <OptionWrapper key={opt}>
            {opt === activeValue && <Arrow>▼</Arrow>}
            <Option active={opt === activeValue}>{opt}</Option>
            {opt === activeValue && <Underline />}
          </OptionWrapper>
        ))}
      </OptionsRow>
    </Section>
  );
};

const DiamondFilter = ({ activeValues }) => {
  return (
    <Container>
      <SectionComponent
        title="Color"
        options={['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']}
        activeValue={activeValues.Color}
      />
      <SectionComponent
        title="Clarity"
        options={['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'SI3', 'I1']}
        activeValue={activeValues.Clarity}
      />
      <SectionComponent
        title="Cut"
        options={['MEDIUM', 'GOOD', 'VERY GOOD', 'EXCELLENT']}
        activeValue={activeValues.Cut}
      />
      <SectionComponent
        title="Polish"
        options={['MEDIUM', 'GOOD', 'VERY GOOD', 'EXCELLENT']}
        activeValue={activeValues.Polish}
      />
      <SectionComponent
        title="Symmetry"
        options={['MEDIUM', 'GOOD', 'VERY GOOD', 'EXCELLENT']}
        activeValue={activeValues.Symmetry}
      />
      <SectionComponent
        title="Fluorescence"
        options={['NONE', 'VERY SLIGHT', 'SLIGHT', 'FAINT', 'MEDIUM', 'STRONG', 'VERY STRONG']}
        activeValue={activeValues.Fluorescence}
      />
    </Container>
  );
};

export default DiamondFilter;
