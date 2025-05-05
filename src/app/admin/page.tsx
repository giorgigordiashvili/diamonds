'use client';
import AdminLogin from '@/components/AdminLogin';
import ImageUploader from '@/components/ImageUploader';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Admin Dashboard Component
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('diamonds');
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentDiamond, setCurrentDiamond] = useState<Diamond | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const router = useRouter();

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

  // Handle successful login
  const handleLoginSuccess = (token: string) => {
    // Store token in cookie for middleware authentication
    setCookie('authToken', token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    setIsAuthenticated(true);
    setIsAdmin(true);
    setAuthChecking(false);

    // Fetch data now that we're authenticated
    fetchDiamonds();
  };

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          // Don't redirect, show login form instead
          setAuthChecking(false);
          return;
        }

        // Store token in cookie for middleware authentication
        setCookie('authToken', token, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        const response = await fetch('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const userData = await response.json();
        setIsAuthenticated(true);

        if (userData.role !== 'admin') {
          // Don't redirect, show unauthorized message
          setAuthChecking(false);
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('authToken');
        // Don't redirect, show login form instead
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch diamonds or users from API
  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'diamonds') {
        fetchDiamonds();
      } else if (activeTab === 'users') {
        fetchUsers();
      }
    }
  }, [activeTab, isAdmin]);

  const fetchDiamonds = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/diamonds', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDiamonds(data.diamonds);
    } catch (error) {
      console.error('Error fetching diamonds:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      // Create a custom endpoint to fetch all users (admin-only)
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a diamond
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this diamond?')) {
      try {
        const token = localStorage.getItem('authToken');
        await fetch(`/api/diamonds/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchDiamonds();
      } catch (error) {
        console.error('Error deleting diamond:', error);
      }
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    if (confirm('Are you sure you want to promote this user to admin?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/users/promote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          // Refresh the users list
          fetchUsers();
          alert('User has been promoted to admin');
        } else {
          const errorData = await response.json();
          alert(`Failed to promote user: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error promoting user:', error);
        alert('An error occurred while promoting the user');
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

  // Render users table
  const renderUsersTable = () => (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id.slice(0, 6)}...</td>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {user.role !== 'admin' && (
                    <Button onClick={() => handlePromoteToAdmin(user.id)}>Make Admin</Button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </>
  );

  // If still checking authentication
  if (authChecking) {
    return <div>Loading...</div>;
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // If authenticated but not admin, show unauthorized message
  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>Unauthorized</h1>
        <p>You do not have permission to access the admin dashboard.</p>
        <button
          onClick={() => {
            localStorage.removeItem('authToken');
            router.push('/');
          }}
          style={{
            padding: '10px 20px',
            background: '#333',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <AdminContainer>
      <Header>
        <Title>Diamond Admin Dashboard</Title>
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={() => {
              localStorage.removeItem('authToken');
              setCookie('authToken', '', { maxAge: -1 });
              router.push('/');
            }}
            style={{
              padding: '8px 12px',
              background: '#333',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </Header>

      <Tabs>
        <Tab active={activeTab === 'diamonds'} onClick={() => setActiveTab('diamonds')}>
          Diamonds
        </Tab>
        <Tab active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
          Orders
        </Tab>
        <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          Users
        </Tab>
      </Tabs>

      {showForm ? (
        renderDiamondForm()
      ) : activeTab === 'diamonds' ? (
        renderDiamondsTable()
      ) : activeTab === 'users' ? (
        renderUsersTable()
      ) : (
        <p>Orders management coming soon...</p>
      )}
    </AdminContainer>
  );
}
