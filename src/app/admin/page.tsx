'use client';
import ImageUploader from '@/components/ImageUploader';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled components for the admin interface
const AdminContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #333;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background: ${(props) => (props.active ? '#333' : 'transparent')};
  color: ${(props) => (props.active ? '#fff' : 'inherit')};
  border: none;
  cursor: pointer;
  font-size: 16px;
`;

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

  &:hover {
    background: #555;
  }
`;

const Form = styled.form`
  max-width: 600px;
  margin: 0 auto;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border: 1px solid #333;
    background: transparent;
    color: inherit;
  }

  button {
    padding: 10px 20px;
    background: #333;
    color: white;
    border: none;
    cursor: pointer;
  }
`;

interface Diamond {
  id?: string;
  name: string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  certificate: string;
  price: number;
  image?: string;
  description?: string;
}

// Admin Dashboard Component
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('diamonds');
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentDiamond, setCurrentDiamond] = useState<Diamond | null>(null);

  // Default values for a new diamond
  const defaultDiamond = {
    name: '',
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
    description: '',
  };

  // Fetch diamonds from API
  useEffect(() => {
    if (activeTab === 'diamonds') {
      fetchDiamonds();
    }
  }, [activeTab]);

  const fetchDiamonds = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/diamonds');
      const data = await response.json();
      setDiamonds(data.diamonds);
    } catch (error) {
      console.error('Error fetching diamonds:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a diamond
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this diamond?')) {
      try {
        await fetch(`/api/diamonds/${id}`, {
          method: 'DELETE',
        });
        fetchDiamonds();
      } catch (error) {
        console.error('Error deleting diamond:', error);
      }
    }
  };

  // Edit a diamond
  const handleEdit = (diamond: Diamond) => {
    setCurrentDiamond(diamond);
    setShowForm(true);
  };

  // Add new diamond
  const handleAdd = () => {
    setCurrentDiamond(defaultDiamond);
    setShowForm(true);
  };

  // Handle image upload completion
  const handleImageUploaded = (fileId: string, url: string) => {
    if (currentDiamond) {
      setCurrentDiamond({
        ...currentDiamond,
        image: url,
      });
    }
  };

  // Save diamond (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentDiamond) return;

    try {
      const method = currentDiamond.id ? 'PUT' : 'POST';
      const url = currentDiamond.id ? `/api/diamonds/${currentDiamond.id}` : '/api/diamonds';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentDiamond),
      });

      if (response.ok) {
        fetchDiamonds();
        setShowForm(false);
        setCurrentDiamond(null);
      }
    } catch (error) {
      console.error('Error saving diamond:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (!currentDiamond) return;

    // Convert numeric values
    const newValue = type === 'number' ? parseFloat(value) : value;

    setCurrentDiamond({
      ...currentDiamond,
      [name]: newValue,
    });
  };

  // Render diamond form
  const renderDiamondForm = () => (
    <Form onSubmit={handleSubmit}>
      <h2>{currentDiamond?.id ? 'Edit Diamond' : 'Add New Diamond'}</h2>

      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={currentDiamond?.name || ''}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor="shape">Shape</label>
        <select
          id="shape"
          name="shape"
          value={currentDiamond?.shape || 'Brilliant'}
          onChange={handleInputChange}
          required
        >
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
      </div>

      <div>
        <label htmlFor="carat">Carat</label>
        <input
          type="number"
          id="carat"
          name="carat"
          step="0.01"
          value={currentDiamond?.carat || 0}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor="color">Color</label>
        <select
          id="color"
          name="color"
          value={currentDiamond?.color || 'D'}
          onChange={handleInputChange}
          required
        >
          <option value="D">D</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="G">G</option>
          <option value="H">H</option>
          <option value="I">I</option>
          <option value="J">J</option>
          <option value="K">K</option>
          <option value="L">L</option>
          <option value="M">M</option>
        </select>
      </div>

      <div>
        <label htmlFor="clarity">Clarity</label>
        <select
          id="clarity"
          name="clarity"
          value={currentDiamond?.clarity || 'IF'}
          onChange={handleInputChange}
          required
        >
          <option value="FL">FL</option>
          <option value="IF">IF</option>
          <option value="VVS1">VVS1</option>
          <option value="VVS2">VVS2</option>
          <option value="VS1">VS1</option>
          <option value="VS2">VS2</option>
          <option value="SI1">SI1</option>
          <option value="SI2">SI2</option>
          <option value="I1">I1</option>
          <option value="I2">I2</option>
          <option value="I3">I3</option>
        </select>
      </div>

      <div>
        <label htmlFor="cut">Cut</label>
        <select
          id="cut"
          name="cut"
          value={currentDiamond?.cut || 'Excellent'}
          onChange={handleInputChange}
          required
        >
          <option value="Excellent">Excellent</option>
          <option value="Very Good">Very Good</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
      </div>

      <div>
        <label htmlFor="polish">Polish</label>
        <select
          id="polish"
          name="polish"
          value={currentDiamond?.polish || 'Excellent'}
          onChange={handleInputChange}
          required
        >
          <option value="Excellent">Excellent</option>
          <option value="Very Good">Very Good</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
      </div>

      <div>
        <label htmlFor="symmetry">Symmetry</label>
        <select
          id="symmetry"
          name="symmetry"
          value={currentDiamond?.symmetry || 'Excellent'}
          onChange={handleInputChange}
          required
        >
          <option value="Excellent">Excellent</option>
          <option value="Very Good">Very Good</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
      </div>

      <div>
        <label htmlFor="fluorescence">Fluorescence</label>
        <select
          id="fluorescence"
          name="fluorescence"
          value={currentDiamond?.fluorescence || 'None'}
          onChange={handleInputChange}
          required
        >
          <option value="None">None</option>
          <option value="Faint">Faint</option>
          <option value="Medium">Medium</option>
          <option value="Strong">Strong</option>
          <option value="Very Strong">Very Strong</option>
        </select>
      </div>

      <div>
        <label htmlFor="certificate">Certificate</label>
        <select
          id="certificate"
          name="certificate"
          value={currentDiamond?.certificate || 'GIA'}
          onChange={handleInputChange}
          required
        >
          <option value="GIA">GIA</option>
          <option value="IGI">IGI</option>
          <option value="HRD">HRD</option>
          <option value="AGS">AGS</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={currentDiamond?.price || 0}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={currentDiamond?.description || ''}
          onChange={handleInputChange}
          rows={4}
        />
      </div>

      {/* Replace the image URL field with the ImageUploader component */}
      <ImageUploader
        onImageUploaded={handleImageUploaded}
        currentImageUrl={currentDiamond?.image}
      />

      {currentDiamond?.image && (
        <div style={{ marginBottom: '15px' }}>
          <label>Current Image</label>
          <div style={{ marginTop: '8px' }}>
            <a
              href={currentDiamond.image}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#aaa' }}
            >
              {currentDiamond.image}
            </a>
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            setShowForm(false);
            setCurrentDiamond(null);
          }}
        >
          Cancel
        </button>
      </div>
    </Form>
  );

  // Render diamonds table
  const renderDiamondsTable = () => (
    <>
      <div style={{ marginBottom: '20px', textAlign: 'right' }}>
        <Button onClick={handleAdd}>Add New Diamond</Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Shape</th>
              <th>Carat</th>
              <th>Color</th>
              <th>Clarity</th>
              <th>Price</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {diamonds.map((diamond) => (
              <tr key={diamond.id}>
                <td>{diamond.id?.slice(0, 6)}...</td>
                <td>{diamond.name}</td>
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
                      View
                    </a>
                  ) : (
                    'None'
                  )}
                </td>
                <td>
                  <Button onClick={() => handleEdit(diamond)}>Edit</Button>
                  <Button onClick={() => handleDelete(diamond.id!)}>Delete</Button>
                </td>
              </tr>
            ))}
            {diamonds.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center' }}>
                  No diamonds found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </>
  );

  return (
    <AdminContainer>
      <Header>
        <Title>Diamond Admin Dashboard</Title>
      </Header>

      <Tabs>
        <Tab active={activeTab === 'diamonds'} onClick={() => setActiveTab('diamonds')}>
          Diamonds
        </Tab>
        <Tab active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
          Orders
        </Tab>
      </Tabs>

      {showForm ? (
        renderDiamondForm()
      ) : activeTab === 'diamonds' ? (
        renderDiamondsTable()
      ) : (
        <p>Orders management coming soon...</p>
      )}
    </AdminContainer>
  );
}
