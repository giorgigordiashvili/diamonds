import React from 'react';
import styled from 'styled-components';

interface OptionProps {
  active: boolean;
}

interface SectionComponentProps {
  title: string;
  options: string[];
  activeValue: string;
}

interface DiamondFilterProps {
  activeValues: {
    Color: string;
    Clarity: string;
    Cut: string;
    Polish: string;
    Symmetry: string;
    Fluorescence: string;
  };
  dictionary: any;
}

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

const Option = styled.div<OptionProps>`
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

const SectionComponent: React.FC<SectionComponentProps> = ({ title, options, activeValue }) => {
  return (
    <Section>
      <Title>{title}</Title>
      <OptionsRow>
        {options.map((opt) => (
          <OptionWrapper key={opt}>
            {opt.toLowerCase() === activeValue.toLowerCase() && <Arrow>▼</Arrow>}
            <Option active={opt.toLowerCase() === activeValue.toLowerCase()}>{opt}</Option>
            {opt.toLowerCase() === activeValue.toLowerCase() && <Underline />}
          </OptionWrapper>
        ))}
      </OptionsRow>
    </Section>
  );
};

const DiamondFilter: React.FC<DiamondFilterProps> = ({ activeValues, dictionary }) => {
  const filterDict = dictionary?.diamondFilter || {};
  console.log(activeValues);
  return (
    <Container>
      <SectionComponent
        title={filterDict.colorTitle || 'Color'}
        options={['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']}
        activeValue={activeValues.Color}
      />
      <SectionComponent
        title={filterDict.clarityTitle || 'Clarity'}
        options={['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'SI3', 'I1']}
        activeValue={activeValues.Clarity}
      />
      <SectionComponent
        title={filterDict.cutTitle || 'Cut'}
        options={['MEDIUM', 'GOOD', 'VERY GOOD', 'EXCELLENT']}
        activeValue={activeValues.Cut}
      />
      <SectionComponent
        title={filterDict.polishTitle || 'Polish'}
        options={['MEDIUM', 'GOOD', 'VERY GOOD', 'EXCELLENT']}
        activeValue={activeValues.Polish}
      />
      <SectionComponent
        title={filterDict.symmetryTitle || 'Symmetry'}
        options={['MEDIUM', 'GOOD', 'VERY GOOD', 'EXCELLENT']}
        activeValue={activeValues.Symmetry}
      />
      <SectionComponent
        title={filterDict.fluorescenceTitle || 'Fluorescence'}
        options={['NONE', 'VERY SLIGHT', 'SLIGHT', 'FAINT', 'MEDIUM', 'STRONG', 'VERY STRONG']}
        activeValue={activeValues.Fluorescence}
      />
    </Container>
  );
};

export default DiamondFilter;
