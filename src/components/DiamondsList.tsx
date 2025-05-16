import { diamondsApi } from '@/api';
import { useApi } from '@/hooks/useApi';
import { Diamond } from '@/types/diamond';
import Image from 'next/image';
import Link from 'next/link'; // Added Link import
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Scroll from './Scroll';
import SortingDropdown from './SortingDropdown';

const Page = styled.div`
  width: fit-content;
  justify-self: self-start;
`;
const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  @media screen and (max-width: 1150px) {
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
  }
  &.col-polish {
    flex: 1 1 90px;
    justify-content: flex-start;
  }
  &.col-symmetry {
    flex: 1 1 90px;
    justify-content: flex-start;
  }
  &.col-fluorescence {
    flex: 1 1 100px;
    justify-content: flex-start;
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
  filterParams: Partial<diamondsApi.DiamondSearchParams>;
  onFilterChange: (filterName: string, value: any) => void;
  dictionary: any; // Added dictionary prop
}

const DiamondsList: React.FC<DiamondsListProps> = ({
  filterParams,
  onFilterChange,
  dictionary,
}) => {
  const { data, loading, error, execute: fetchDiamonds } = useApi(diamondsApi.getDiamonds);
  const [sortColumn, setSortColumn] = useState<string>(filterParams.sortBy || 'price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(filterParams.sortOrder || 'asc');

  const currentPage = filterParams.page || 1;
  const itemsPerPage = filterParams.limit || 10;

  useEffect(() => {
    const paramsToFetch: diamondsApi.DiamondSearchParams = {
      ...filterParams,
      page: currentPage,
      limit: itemsPerPage,
      sortBy: sortColumn === 'relevance' ? undefined : sortColumn,
      sortOrder: sortColumn === 'relevance' ? undefined : sortOrder,
    };
    fetchDiamonds(paramsToFetch);
  }, [fetchDiamonds, sortColumn, sortOrder, filterParams, currentPage, itemsPerPage]);

  const diamonds = data?.diamonds || [];
  const totalDiamonds = data?.total || 0;
  const totalPages = Math.ceil(totalDiamonds / itemsPerPage);

  const formatPrice = (price: number) => {
    return `€ ${price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${dictionary.priceSuffix}`;
  };

  const handleTableHeaderSort = (columnApiKey: string) => {
    if (columnApiKey === 'relevance') return;
    if (sortColumn === columnApiKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnApiKey);
      setSortOrder('asc');
    }
  };

  const handleSortDropdownChange = (selectedApiKey: string) => {
    if (selectedApiKey === 'relevance') {
      setSortColumn('relevance');
    } else if (sortColumn === selectedApiKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(selectedApiKey);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      onFilterChange('page', newPage);
    }
  };

  if (loading) {
    return <Page>{dictionary.loading}</Page>;
  }

  if (error) {
    return (
      <Page>
        {dictionary.errorPrefix} {error.message}
      </Page>
    );
  }

  const tableHeaders = [
    { label: dictionary.headers.shape, key: 'image', sortable: true, apiKey: 'shape', symbol: '' },
    { label: dictionary.headers.carat, key: 'carat', sortable: true, apiKey: 'carat', symbol: '' },
    { label: dictionary.headers.color, key: 'color', sortable: true, apiKey: 'color', symbol: '' },
    {
      label: dictionary.headers.clarity,
      key: 'clarity',
      sortable: true,
      apiKey: 'clarity',
      symbol: '',
    },
    { label: dictionary.headers.cut, key: 'cut', sortable: true, apiKey: 'cut', symbol: '' },
    {
      label: dictionary.headers.polish,
      key: 'polish',
      sortable: true,
      apiKey: 'polish',
      symbol: '',
    },
    {
      label: dictionary.headers.symmetry,
      key: 'symmetry',
      sortable: true,
      apiKey: 'symmetry',
      symbol: '',
    },
    {
      label: dictionary.headers.fluorescence,
      key: 'fluorescence',
      sortable: true,
      apiKey: 'fluorescence',
      symbol: '',
    },
    {
      label: dictionary.headers.certificate,
      key: 'certificate',
      sortable: true,
      apiKey: 'certificate',
      symbol: '',
    },
    { label: dictionary.headers.price, key: 'price', sortable: true, apiKey: 'price', symbol: '' },
  ];

  console.log('[DiamondsList Debug]', {
    diamondsLength: diamonds.length,
    totalDiamonds,
    itemsPerPage,
    totalPages,
    currentPage,
    loading,
    error,
  });

  return (
    <Page>
      <Head>
        <Title>
          {totalDiamonds.toLocaleString('de-DE')} {dictionary.titleSuffix}
        </Title>
        <Line>
          <SortingDropdown
            onSortSelect={handleSortDropdownChange}
            currentSortByApiKey={sortColumn}
          />
        </Line>
      </Head>
      <TableContainer>
        <TableHeaderRow>
          {tableHeaders.map((header) => (
            <TableHeaderCell
              key={header.key}
              className={`col-${header.key}`}
              onClick={() => header.sortable && handleTableHeaderSort(header.apiKey)}
            >
              {header.sortable && (
                <span style={{ marginRight: '4px' }}>
                  {sortColumn === header.apiKey ? (
                    sortOrder === 'asc' ? (
                      '▲'
                    ) : (
                      '▼'
                    )
                  ) : (
                    <>
                      ▲<br />▼
                    </>
                  )}
                </span>
              )}
              {!header.sortable && header.symbol && <span>{header.symbol}</span>}
              {header.label}
            </TableHeaderCell>
          ))}
        </TableHeaderRow>
        {diamonds.map((diamond: Diamond) => (
          <Link href={`/diamond/${diamond.id}`} key={diamond.id} passHref>
            <TableDataRow>
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
              <TableDataCell className="col-certificate">
                {diamond.certificate || '-'}
              </TableDataCell>
              <TableDataCell className="col-price">{formatPrice(diamond.price)}</TableDataCell>
            </TableDataRow>
          </Link>
        ))}
      </TableContainer>
      {diamonds.length > 0 && totalPages > 0 && (
        <Scroll currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </Page>
  );
};

export default DiamondsList;
