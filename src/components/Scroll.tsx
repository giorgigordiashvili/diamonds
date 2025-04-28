import React, { useState } from 'react';
import styled from 'styled-components';

const Scroll: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages: number = 968;

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getVisiblePages = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    // Start with the current page
    pages.push(currentPage);

    // Add the next two pages if they exist
    if (currentPage + 1 <= totalPages) {
      pages.push(currentPage + 1);
    }
    if (currentPage + 2 <= totalPages) {
      pages.push(currentPage + 2);
    }

    // Add ellipsis if the last page we added is not the second-to-last page
    if (currentPage + 2 < totalPages - 1) {
      pages.push('...');
    }

    // Always add the last page if it's not already included
    if (currentPage + 2 < totalPages) {
      pages.push(totalPages);
    }

    return pages;
  };

  const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 4px;
  `;

  const ArrowButton = styled.button`
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    padding: 4px 8px;
    &:hover {
      cursor: pointer;
    }
    &:disabled {
      cursor: not-allowed;
    }
  `;

  const PageButton = styled.button<{ isActive: boolean }>`
    border: ${(props) => (props.isActive ? '2px solid #fff' : 'transparent')};
    color: ${(props) => (props.isActive ? 'white' : 'rgba(168, 168, 168, 1)')};
    font-size: 14px;
    padding: 4px 8px;
    margin: 0 2px;
    background-color: black;
    cursor: pointer;
  `;

  const Dots = styled.span`
    color: white;
    padding: 4px 8px;
  `;

  const visiblePages = getVisiblePages();

  return (
    <Container>
      <ArrowButton onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="11 17 6 12 11 7"></polyline>
          <polyline points="18 17 13 12 18 7"></polyline>
        </svg>
      </ArrowButton>
      <ArrowButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </ArrowButton>

      {visiblePages.map((page, index) =>
        typeof page === 'string' ? (
          <Dots key={`dots-${index}`}>{page}</Dots>
        ) : (
          <PageButton
            key={page}
            isActive={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </PageButton>
        )
      )}

      <ArrowButton
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </ArrowButton>
      <ArrowButton
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="13 17 18 12 13 7"></polyline>
          <polyline points="6 17 11 12 6 7"></polyline>
        </svg>
      </ArrowButton>
    </Container>
  );
};

export default Scroll;
