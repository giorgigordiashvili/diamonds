import { diamondsApi } from '@/api';
import { useApi } from '@/hooks/useApi';
import { Diamond } from '@/types/diamond';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Scroll from './Scroll';
import SortingDropdown from './SortingDropdown';

// Define the DiamondFilterParams interface
interface DiamondFilterParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  // Add other filter parameters as needed
}

const Page = styled.div`
  width: 100%;
`;
const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  @media screen and (max-width: 980px) {
    margin-top: 24px;
  }
  @media screen and (max-width: 465px) {
    display: block;
  }
`;
const Title = styled.div`
  font-weight: 300;
  font-size: 18.59px;
  line-height: 32px;
  letter-spacing: 0.4px;
`;

const Line = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-weight: 700;
  font-size: 12.69px;
  line-height: 32px;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  @media screen and (max-width: 465px) {
    justify-content: flex-start;
    text-align: left;
    margin-top: 8px;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 13px;
`;

const TableCellBase = styled.div`
  padding: 10px 8px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  line-height: 1.3;
  white-space: nowrap;

  &.col-image {
    flex: 0 0 65px;
    justify-content: center;
  }
  &.col-carat {
    flex: 0 0 60px;
    justify-content: flex-start;
  }
  &.col-color {
    flex: 0 0 60px;
    justify-content: flex-start;
  }
  &.col-clarity {
    flex: 0 0 70px;
    justify-content: flex-start;
  }
  &.col-cut {
    flex: 1 1 90px;
    justify-content: flex-start;
    min-width: 90px;
  }
  &.col-polish {
    flex: 1 1 90px;
    justify-content: flex-start;
    min-width: 90px;
  }
  &.col-symmetry {
    flex: 1 1 90px;
    justify-content: flex-start;
    min-width: 90px;
  }
  &.col-fluorescence {
    flex: 1 1 100px;
    justify-content: flex-start;
    min-width: 100px;
  }
  &.col-certificate {
    flex: 0 0 70px;
    justify-content: flex-start;
  }
  &.col-price {
    flex: 0 0 150px;
    justify-content: flex-start;
  }
`;

const TableHeaderRow = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #555;
  background-color: #1a1a1a;

  @media screen and (min-width: 981px) {
    display: grid;
    grid-template-columns: 100fr 88fr 88fr 98fr 95fr 95fr 97fr 128fr 135fr 170fr;
  }
`;

const TableHeaderCell = styled(TableCellBase)`
  font-weight: bold;
  color: #cccccc;
  cursor: pointer;
  user-select: none;
  span {
    margin-right: 3px;
    font-size: 10px;
  }
`;

const TableDataRow = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  border-bottom: 1px solid #383838;
  &:hover {
    background-color: #282828;
  }
  &:last-child {
    border-bottom: none;
  }

  @media screen and (min-width: 981px) {
    display: grid;
    grid-template-columns: 100fr 88fr 88fr 98fr 95fr 95fr 97fr 128fr 135fr 170fr;
  }
`;

const TableDataCell = styled(TableCellBase)`
  color: #fff;

  &.col-price {
    font-weight: bold;
  }
`;

const StyledImageCard = styled.div`
  width: 45px;
  height: 45px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #fff;
  border-radius: 2px;
`;

interface DiamondsListProps {
  filterParams: DiamondFilterParams;
}

const DiamondsList: React.FC<DiamondsListProps> = ({ filterParams }) => {
  const { data, loading, error, execute: fetchDiamonds } = useApi(diamondsApi.getDiamonds);
  const [sortColumn, setSortColumn] = useState<string>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const paramsToFetch = {
      ...filterParams,
      sortBy: sortColumn,
      sortOrder,
    };
    fetchDiamonds(paramsToFetch);
  }, [fetchDiamonds, sortColumn, sortOrder, filterParams]);

  const diamonds = data?.diamonds || [];
  const totalDiamonds = data?.total || 0;

  const formatPrice = (price: number) => {
    return `€ ${price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} incl. VAT`;
  };

  if (loading) {
    return <Page>Loading diamonds...</Page>;
  }

  if (error) {
    return <Page>Error loading diamonds: {error.message}</Page>;
  }

  const tableHeaders = [
    { label: 'Shape', key: 'image', sortable: false, apiKey: 'shape', symbol: '' },
    { label: 'Carat', key: 'carat', sortable: true, apiKey: 'carat', symbol: '' },
    { label: 'Color', key: 'color', sortable: true, apiKey: 'color', symbol: '' },
    { label: 'Clarity', key: 'clarity', sortable: true, apiKey: 'clarity', symbol: '' },
    { label: 'Cut', key: 'cut', sortable: true, apiKey: 'cut', symbol: '' },
    { label: 'Polish', key: 'polish', sortable: true, apiKey: 'polish', symbol: '' },
    { label: 'Symmetry', key: 'symmetry', sortable: true, apiKey: 'symmetry', symbol: '' },
    {
      label: 'Fluorescence',
      key: 'fluorescence',
      sortable: true,
      apiKey: 'fluorescence',
      symbol: '',
    },
    { label: 'Certificate', key: 'certificate', sortable: true, apiKey: 'certificate', symbol: '' },
    { label: 'Price', key: 'price', sortable: true, apiKey: 'price', symbol: '' },
  ];

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortOrder('asc');
    }
  };

  return (
    <Page>
      <Head>
        <Title>{totalDiamonds.toLocaleString('de-DE')} Diamonds</Title>
        <Line>
          <SortingDropdown />
        </Line>
      </Head>
      <TableContainer>
        <TableHeaderRow>
          {tableHeaders.map((header) => (
            <TableHeaderCell
              key={header.key}
              className={`col-${header.key}`}
              onClick={() => header.sortable && handleSort(header.apiKey)}
            >
              {header.sortable && (
                <span>
                  {sortColumn === header.apiKey ? (sortOrder === 'asc' ? '▲' : '▼') : '◆'}
                </span>
              )}
              {!header.sortable && header.symbol && <span>{header.symbol}</span>}
              {header.label}
            </TableHeaderCell>
          ))}
        </TableHeaderRow>
        {diamonds.map((diamond: Diamond) => (
          <TableDataRow key={diamond.id}>
            <TableDataCell className="col-image">
              <StyledImageCard>
                <Image
                  src={diamond.image || '/assets/diamonds/Diamant.png'}
                  alt={diamond.shape || 'diamond'}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </StyledImageCard>
            </TableDataCell>
            <TableDataCell className="col-carat">{diamond.carat.toFixed(2)}</TableDataCell>
            <TableDataCell className="col-color">{diamond.color}</TableDataCell>
            <TableDataCell className="col-clarity">{diamond.clarity}</TableDataCell>
            <TableDataCell className="col-cut">{diamond.cut || '-'}</TableDataCell>
            <TableDataCell className="col-polish">{diamond.polish || '-'}</TableDataCell>
            <TableDataCell className="col-symmetry">{diamond.symmetry || '-'}</TableDataCell>
            <TableDataCell className="col-fluorescence">
              {diamond.fluorescence || '-'}
            </TableDataCell>
            <TableDataCell className="col-certificate">{diamond.certificate || '-'}</TableDataCell>
            <TableDataCell className="col-price">{formatPrice(diamond.price)}</TableDataCell>
          </TableDataRow>
        ))}
      </TableContainer>
      {diamonds.length > 0 && <Scroll />}
    </Page>
  );
};

export default DiamondsList;
