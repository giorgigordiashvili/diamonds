'use client';

import { getDictionary } from '@/get-dictionary';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Diamond } from '../../types/diamond'; // Import Diamond from types
import DiamondForm from './DiamondForm'; // Import the new DiamondForm component

// Styled components (can be moved to a shared file or defined within AdminDashboardClient if preferred)
const Container = styled.div`
  // Added a Container styled-component
  padding: 20px;
  color: #e0e0e0; // Light gray text for readability on black background
  background-color: #000000; // Black background
  border-radius: 8px; // Rounded corners for the container
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); // Subtle shadow - consider if this is visible/needed on black
`;

const TabTitle = styled.h2`
  // Styled component for the title
  font-size: 24px; // Consistent with AdminDashboardClient Title
  font-weight: 500; // Medium weight
  color: #ffffff; // White title
  margin-bottom: 20px; // Add some space below the title
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1); // Lighter shadow for dark background
  border-radius: 8px;
  overflow: hidden;

  th,
  td {
    border: 1px solid #444; // Darker border, but visible on black
    padding: 12px 15px;
    text-align: left;
    color: #e0e0e0; // Light text for table content
  }

  th {
    background-color: #222; // Darker header background
    color: #ffffff; // White text for headers
    font-weight: 600;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background-color: #1a1a1a; // Slightly lighter black for hover
  }
`;

const Button = styled.button`
  padding: 8px 12px;
  background-color: #007bff; // Primary blue color
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 8px;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #0056b3; // Darker blue on hover
  }

  &.delete-button {
    background-color: #dc3545; // Red color for delete
    &:hover {
      background-color: #c82333; // Darker red on hover
    }
  }
`;

const ActionButtonContainer = styled.div`
  // Container for action buttons
  display: flex;
  gap: 8px; // Space between buttons
`;

interface DiamondsTabProps {
  adminDict: Awaited<ReturnType<typeof getDictionary>>['admin'];
}

export default function DiamondsTab({ adminDict }: DiamondsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [currentDiamond, setCurrentDiamond] = useState<Diamond | null>(null);
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [loading, setLoading] = useState(true); // Remains true initially

  const fetchDiamonds = useCallback(async () => {
    setLoading(true); // Ensure loading is true when fetching starts
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/diamonds', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDiamonds(data.diamonds);
      } else {
        console.error('Failed to fetch diamonds');
        if (response.status === 401 || response.status === 403) {
          alert('Authentication error fetching diamonds. Please re-login.');
        }
      }
    } catch (error) {
      console.error('Error fetching diamonds:', error);
      alert('Error fetching diamonds. See console for details.');
    } finally {
      setLoading(false); // Ensure loading is false after fetching completes or fails
    }
  }, []);

  useEffect(() => {
    fetchDiamonds();
  }, [fetchDiamonds]);

  if (loading) {
    return <p>{adminDict.loading}</p>; // Or any other loading indicator
  }

  const defaultDiamond: Omit<Diamond, 'id'> = {
    name_en: '', // Changed from name
    name_ka: '', // Added
    shape: 'Brilliant',
    carat: 0,
    color: 'D',
    clarity: 'IF',
    cut: 'Excellent',
    polish: 'Excellent',
    symmetry: 'Excellent',
    fluorescence: 'None',
    certificate: 'GIA',
    price: 0,
    description_en: '', // Changed from description
    description_ka: '', // Added
    image: '',
    inStock: 0, // Default inStock to 0 for new diamonds
  };

  const handleEdit = (diamond: Diamond) => {
    setCurrentDiamond(diamond);
    setShowForm(true);
  };

  const handleAdd = () => {
    setCurrentDiamond(defaultDiamond as Diamond);
    setShowForm(true);
  };

  const handleImageUploaded = (fileId: string, url: string) => {
    if (currentDiamond) {
      setCurrentDiamond({
        ...currentDiamond,
        image: url,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDiamond) return;
    try {
      const method = currentDiamond.id ? 'PUT' : 'POST';
      const url = currentDiamond.id ? `/api/diamonds/${currentDiamond.id}` : '/api/diamonds';
      const token = localStorage.getItem('authToken');
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentDiamond),
      });
      if (response.ok) {
        fetchDiamonds();
        setShowForm(false);
        setCurrentDiamond(null);
      } else {
        const errorData = await response.json();
        alert(`Error saving diamond: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving diamond:', error);
      alert(`Error saving diamond: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | boolean = value;

    if (type === 'number') {
      processedValue = parseFloat(value) || 0;
    } else if (name === 'inStock') {
      // Keep inStock as a number
      processedValue = parseInt(value, 10);
      if (isNaN(processedValue)) {
        processedValue = 0; // Default to 0 if parsing fails
      }
    } else if (type === 'checkbox') {
      // This case might no longer be needed if no other checkboxes exist
      processedValue = (e.target as HTMLInputElement).checked;
    }

    if (currentDiamond) {
      setCurrentDiamond({
        ...currentDiamond,
        [name]: processedValue,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(adminDict.alerts.confirmDeleteDiamond)) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/diamonds/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          fetchDiamonds();
        } else {
          const errorData = await response.json();
          alert(`Error deleting diamond: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting diamond:', error);
        alert(
          `Error deleting diamond: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
  };

  if (showForm) {
    return (
      <DiamondForm
        adminDict={adminDict}
        currentDiamond={currentDiamond}
        onClose={() => {
          setShowForm(false);
          setCurrentDiamond(null);
        }}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        onImageUploaded={handleImageUploaded}
      />
    );
  }
  return (
    <Container>
      {' '}
      {/* Added Container */}
      <TabTitle>{adminDict.tabs.diamonds}</TabTitle> {/* Added TabTitle */}
      <div style={{ marginBottom: '20px', textAlign: 'right' }}>
        <Button onClick={handleAdd}>{adminDict.diamondsTable.addNewButton}</Button>
      </div>
      {loading ? (
        <p>{adminDict.loading}</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>{adminDict.diamondsTable.headerId}</th>
              <th>{adminDict.diamondsTable.headerNameEn}</th> {/* Changed */}
              <th>{adminDict.diamondsTable.headerNameKa}</th> {/* Added */}
              <th>{adminDict.diamondsTable.headerShape}</th>
              <th>{adminDict.diamondsTable.headerCarat}</th>
              <th>{adminDict.diamondsTable.headerColor}</th>
              <th>{adminDict.diamondsTable.headerClarity}</th>
              <th>{adminDict.diamondsTable.headerPrice}</th>
              <th>{adminDict.diamondsTable.headerInStock}</th> {/* Added In Stock header */}
              <th>{adminDict.diamondsTable.headerImage}</th>
              <th>{adminDict.diamondsTable.headerActions}</th>
            </tr>
          </thead>
          <tbody>
            {diamonds.map((diamond) => (
              <tr key={diamond.id}>
                <td>{diamond.id?.slice(0, 6)}...</td>
                <td>{diamond.name_en}</td>
                <td>{diamond.name_ka}</td> {/* Added */}
                <td>{diamond.shape}</td>
                <td>{diamond.carat}</td>
                <td>{diamond.color}</td>
                <td>{diamond.clarity}</td>
                <td>${diamond.price.toLocaleString()}</td>
                <td>{diamond.inStock}</td> {/* Display In Stock quantity */}
                <td>
                  {diamond.image ? (
                    <a
                      href={diamond.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#6bbaff' }} // Light blue for link, consistent with ViewDetailsButton
                    >
                      <Image
                        src={diamond.image}
                        alt={diamond.name_en || 'Diamond'} // Use English name for alt text
                        width={50}
                        height={50}
                        style={{ objectFit: 'contain' }}
                      />
                    </a>
                  ) : (
                    adminDict.diamondsTable.noImage
                  )}
                </td>
                <td>
                  <ActionButtonContainer>
                    {' '}
                    {/* Group buttons */}
                    <Button onClick={() => handleEdit(diamond)}>
                      {adminDict.diamondsTable.editAction}
                    </Button>
                    <Button
                      className="delete-button"
                      onClick={() => diamond.id && handleDelete(diamond.id)}
                    >
                      {adminDict.diamondsTable.deleteAction}
                    </Button>
                  </ActionButtonContainer>
                </td>
              </tr>
            ))}
            {diamonds.length === 0 && (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center' }}>
                  {/* Adjusted colSpan */}
                  {adminDict.diamondsTable.noDiamondsFound}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
