import React from 'react';
import styled from 'styled-components';

interface ScrollProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Scroll: React.FC<ScrollProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getVisiblePages = (): (number | string)[] => {
    const visible: (number | string)[] = [];
    if (totalPages === 0) return []; // If no pages, show nothing.
    if (totalPages <= 7) {
      // Show all pages if 7 or less (this handles totalPages === 1 correctly)
      for (let i = 1; i <= totalPages; i++) {
        visible.push(i);
      }
      return visible;
    }

    // Logic for more than 7 pages
    visible.push(1); // Always show first page

    // Ellipsis after first page if current page is far from start
    if (currentPage > 3) {
      visible.push('...');
    }

    // Pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages && !visible.includes(i)) {
        // Ensure not to duplicate 1 or totalPages if they are part of this range
        visible.push(i);
      }
    }

    // Ellipsis before last page if current page is far from end
    if (currentPage < totalPages - 2) {
      visible.push('...');
    }

    // Always show last page (if not already included)
    if (!visible.includes(totalPages)) {
      visible.push(totalPages);
    }
    return visible;
  };

  const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
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
    &:disabled {
      cursor: not-allowed;
    }
  `;

  const Dots = styled.span`
    color: white;
    padding: 4px 8px;
  `;

  const visiblePages = getVisiblePages();

  return (
    <Container>
      <ArrowButton
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1 || totalPages === 0}
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
          <polyline points="11 17 6 12 11 7"></polyline>
          <polyline points="18 17 13 12 18 7"></polyline>
        </svg>
      </ArrowButton>
      <ArrowButton
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || totalPages === 0}
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
            disabled={totalPages === 0}
          >
            {page}
          </PageButton>
        )
      )}

      <ArrowButton
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
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
        disabled={currentPage === totalPages || totalPages === 0}
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
