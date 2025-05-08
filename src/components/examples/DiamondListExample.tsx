'use client';

import { diamondsApi } from '@/api';
import { useApi } from '@/hooks/useApi';
import { Diamond } from '@/types/diamond';
import { useEffect, useState } from 'react';

interface DiamondListProps {
  initialFilters?: Partial<diamondsApi.DiamondSearchParams>;
}

export default function DiamondListExample({ initialFilters = {} }: DiamondListProps) {
  const [filters, setFilters] = useState<Partial<diamondsApi.DiamondSearchParams>>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  // Use our custom hook to fetch diamonds
  const { data, loading, error, execute: fetchDiamonds } = useApi(diamondsApi.getDiamonds);

  // Fetch diamonds when filters change
  useEffect(() => {
    fetchDiamonds(filters);
  }, [filters, fetchDiamonds]);

  // Handle filter changes
  const handleFilterChange = (name: string, value: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
      // Reset to first page when filters change
      ...(name !== 'page' && { page: 1 }),
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    handleFilterChange('page', newPage);
  };

  // Add diamond to cart
  const handleAddToCart = async (diamondId: string) => {
    try {
      // Import dynamically to avoid circular dependencies
      const { cartApi } = await import('@/api');
      await cartApi.addToCart(diamondId, 1);
      alert('Diamond added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add to cart');
    }
  };

  if (loading && !data) {
    return <div>Loading diamonds...</div>;
  }

  if (error) {
    return <div>Error loading diamonds: {error.message}</div>;
  }

  if (!data?.diamonds || data.diamonds.length === 0) {
    return <div>No diamonds found matching your criteria</div>;
  }

  return (
    <div>
      <h2>Diamonds</h2>

      {/* Simple filter controls */}
      <div className="filters">
        <div>
          <label>
            Min Price:
            <input
              type="number"
              value={filters.priceMin || ''}
              onChange={(e) =>
                handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </label>
        </div>
        <div>
          <label>
            Max Price:
            <input
              type="number"
              value={filters.priceMax || ''}
              onChange={(e) =>
                handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </label>
        </div>
        <div>
          <label>
            Shape:
            <select
              value={filters.shape || ''}
              onChange={(e) => handleFilterChange('shape', e.target.value || undefined)}
            >
              <option value="">All Shapes</option>
              <option value="Brilliant">Brilliant</option>
              <option value="Princess">Princess</option>
              <option value="Emerald">Emerald</option>
              <option value="Oval">Oval</option>
              <option value="Marquise">Marquise</option>
              <option value="Radiant">Radiant</option>
              <option value="Cushion">Cushion</option>
              <option value="Asscher">Asscher</option>
              <option value="Heart">Heart</option>
            </select>
          </label>
        </div>
      </div>

      {/* Diamond grid */}
      <div className="diamond-grid">
        {data.diamonds.map((diamond: Diamond) => (
          <div key={diamond.id} className="diamond-card">
            {diamond.image && (
              <img
                src={diamond.image}
                alt={diamond.name}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
            <h3>{diamond.name}</h3>
            <p>
              {diamond.carat}ct {diamond.color} {diamond.clarity}
            </p>
            <p>
              {diamond.shape} - {diamond.cut} cut
            </p>
            <p className="price">${diamond.price.toLocaleString()}</p>
            <button onClick={() => handleAddToCart(diamond.id!)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={filters.page === 1}
          onClick={() => handlePageChange(Number(filters.page) - 1)}
        >
          Previous
        </button>
        <span>Page {filters.page}</span>
        <button
          disabled={(data?.diamonds?.length || 0) < Number(filters.limit)}
          onClick={() => handlePageChange(Number(filters.page) + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
