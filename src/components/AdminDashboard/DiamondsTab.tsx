'use client';

import { getDictionary } from '@/get-dictionary';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import DiamondForm, { Diamond } from './DiamondForm'; // Import the new DiamondForm component and Diamond interface

// Styled components (can be moved to a shared file or defined within AdminDashboardClient if preferred)
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #333;
  }

  th {
    font-weight: 700;
  }
`;

const Button = styled.button`
  padding: 5px 10px;
  background: #333;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 5px;
  font-weight: 500;

  &:hover {
    background: #555;
    color: white;
  }
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
    const { name, value } = e.target;
    let processedValue: string | number = value;

    if (e.target instanceof HTMLInputElement && e.target.type === 'number') {
      processedValue = parseFloat(value) || 0;
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
    <>
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
                <td>
                  {diamond.image ? (
                    <a
                      href={diamond.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#aaa' }}
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
                  <Button onClick={() => handleEdit(diamond)}>
                    {adminDict.diamondsTable.editAction}
                  </Button>
                  <Button onClick={() => diamond.id && handleDelete(diamond.id)}>
                    {adminDict.diamondsTable.deleteAction}
                  </Button>
                </td>
              </tr>
            ))}
            {diamonds.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center' }}>
                  {adminDict.diamondsTable.noDiamondsFound}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </>
  );
}
