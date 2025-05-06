'use client';
import AdminLogin from '@/components/AdminLogin';
import ImageUploader from '@/components/ImageUploader';
import { Order } from '@/types/order';
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
  font-weight: 500;

  &:hover {
    background: #555;
    color: white;
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

const OrderDetailsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
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

interface CartItem {
  diamondId: string;
  quantity: number;
  diamond?: Diamond;
}

interface Cart {
  _id: string;
  userId?: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// Admin Dashboard Component
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('diamonds');
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [carts, setCarts] = useState<Cart[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentDiamond, setCurrentDiamond] = useState<Diamond | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
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

  // Fetch diamonds, users, carts, orders, or payments from API
  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'diamonds') {
        fetchDiamonds();
      } else if (activeTab === 'users') {
        fetchUsers();
      } else if (activeTab === 'carts') {
        fetchCarts();
      } else if (activeTab === 'orders') {
        fetchOrders();
      } else if (activeTab === 'payments') {
        fetchPayments();
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

  const fetchCarts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/carts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCarts(data.carts || []);
    } catch (error) {
      console.error('Error fetching carts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch payments data
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/payments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle clearing a cart
  const handleClearCart = async (cartId: string) => {
    if (confirm('Are you sure you want to clear this cart?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/cart/${cartId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          fetchCarts();
          alert('Cart cleared successfully');
        } else {
          alert('Failed to clear cart');
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  // Handle converting a cart to an order
  const handleConvertToOrder = async (cartId: string, userId: string) => {
    try {
      setSelectedCart(null);
      router.push(`/admin/orders/new?cartId=${cartId}&userId=${userId}`);
    } catch (error) {
      console.error('Error converting cart to order:', error);
    }
  };

  // Handle updating cart item quantity
  const handleUpdateCartItem = async (cartId: string, diamondId: string, quantity: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/cart/items/${diamondId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        // Update the cart in state to reflect changes
        const updatedCartData = await response.json();
        setCarts(carts.map((cart) => (cart._id === cartId ? updatedCartData.cart : cart)));

        // If cart detail modal is open, update it
        if (selectedCart && selectedCart._id === cartId) {
          setSelectedCart(updatedCartData.cart);
        }
      } else {
        alert('Failed to update cart item');
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  // Handle removing an item from the cart
  const handleRemoveCartItem = async (cartId: string, diamondId: string) => {
    if (confirm('Are you sure you want to remove this item from the cart?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/cart/items/${diamondId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Update the cart in state to reflect changes
          const updatedCartData = await response.json();
          setCarts(carts.map((cart) => (cart._id === cartId ? updatedCartData.cart : cart)));

          // If cart detail modal is open, update it
          if (selectedCart && selectedCart._id === cartId) {
            setSelectedCart(updatedCartData.cart);
          }
        } else {
          alert('Failed to remove item from cart');
        }
      } catch (error) {
        console.error('Error removing cart item:', error);
      }
    }
  };

  // Calculate cart total value
  const calculateCartTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => {
      const price = item.diamond?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  // Render cart modal
  const renderCartModal = () => {
    if (!selectedCart) return null;

    const cartTotal = calculateCartTotal(selectedCart.items);
    const userDetails = selectedCart.user
      ? `${selectedCart.user.firstName} ${selectedCart.user.lastName} (${selectedCart.user.email})`
      : 'Guest User';

    return (
      <OrderDetailsModal onClick={() => setSelectedCart(null)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <h2>Cart Details</h2>

          <div style={{ marginBottom: '20px' }}>
            <p>
              <strong>Cart ID:</strong> {selectedCart._id}
            </p>
            <p>
              <strong>User:</strong> {userDetails}
            </p>
            <p>
              <strong>Created:</strong> {new Date(selectedCart.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Last Updated:</strong> {new Date(selectedCart.updatedAt).toLocaleString()}
            </p>
            <p>
              <strong>Total Value:</strong> ${cartTotal.toLocaleString()}
            </p>
          </div>

          <h3>Items ({selectedCart.items.length})</h3>
          <Table>
            <thead>
              <tr>
                <th>Diamond</th>
                <th>Details</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedCart.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.diamond?.name || 'Unknown Diamond'}</td>
                  <td>
                    {item.diamond ? (
                      <>
                        {item.diamond.carat}ct {item.diamond.color} {item.diamond.clarity}
                        <br />
                        {item.diamond.cut} cut
                      </>
                    ) : (
                      'Details not available'
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateCartItem(
                          selectedCart._id,
                          item.diamondId,
                          parseInt(e.target.value)
                        )
                      }
                      style={{ width: '50px' }}
                    />
                  </td>
                  <td>${item.diamond?.price?.toLocaleString() || 'N/A'}</td>
                  <td>${((item.diamond?.price || 0) * item.quantity).toLocaleString()}</td>
                  <td>
                    <Button onClick={() => handleRemoveCartItem(selectedCart._id, item.diamondId)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div
            style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}
          >
            {selectedCart.userId && (
              <Button onClick={() => handleConvertToOrder(selectedCart._id, selectedCart.userId!)}>
                Convert to Order
              </Button>
            )}
            <Button onClick={() => handleClearCart(selectedCart._id)}>Clear Cart</Button>
            <Button onClick={() => setSelectedCart(null)}>Close</Button>
          </div>
        </ModalContent>
      </OrderDetailsModal>
    );
  };

  // Render carts table
  const renderCartsTable = () => (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User Type</th>
              <th>User</th>
              <th>Items</th>
              <th>Total Value</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {carts.map((cart) => {
              const cartTotal = calculateCartTotal(cart.items);
              const userType = cart.userId ? 'Registered' : 'Guest';

              let userName = 'Guest User';
              if (cart.user) {
                userName = `${cart.user.firstName} ${cart.user.lastName} (${cart.user.email})`;
              }

              return (
                <tr key={cart._id}>
                  <td>{cart._id.toString().slice(0, 6)}...</td>
                  <td>{userType}</td>
                  <td>{userName}</td>
                  <td>{cart.items.length} items</td>
                  <td>${cartTotal.toLocaleString()}</td>
                  <td>{new Date(cart.updatedAt).toLocaleString()}</td>
                  <td>
                    <Button onClick={() => setSelectedCart(cart)}>View Details</Button>
                    <Button onClick={() => handleClearCart(cart._id)}>Clear</Button>
                    {cart.userId && (
                      <Button onClick={() => handleConvertToOrder(cart._id, cart.userId ?? '')}>
                        To Order
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
            {carts.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>
                  No active carts found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      {selectedCart && renderCartModal()}
    </>
  );

  // Render order details modal
  const renderOrderModal = () => {
    if (!selectedOrder) return null;

    return (
      <OrderDetailsModal onClick={() => setSelectedOrder(null)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <h2>Order Details</h2>

          <div style={{ marginBottom: '20px' }}>
            <p>
              <strong>Order ID:</strong> {selectedOrder.id}
            </p>
            <p>
              <strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.email})
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.phone}
            </p>
            <p>
              <strong>Date:</strong>{' '}
              {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Total Amount:</strong> ${selectedOrder.totalAmount.toLocaleString()}
            </p>
          </div>

          <h3>Items</h3>
          <Table>
            <thead>
              <tr>
                <th>Diamond</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name || `Diamond ID: ${item.diamondId}`}</td>
                  <td>${item.price.toLocaleString()}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {selectedOrder.shippingAddress && (
            <>
              <h3>Shipping Details</h3>
              <div style={{ marginBottom: '20px' }}>
                <p>
                  <strong>Address:</strong> {selectedOrder.shippingAddress.street}
                </p>
                <p>
                  <strong>City:</strong> {selectedOrder.shippingAddress.city}
                </p>
                {selectedOrder.shippingAddress.state && (
                  <p>
                    <strong>State/Province:</strong> {selectedOrder.shippingAddress.state}
                  </p>
                )}
                <p>
                  <strong>Postal Code:</strong> {selectedOrder.shippingAddress.postalCode}
                </p>
                <p>
                  <strong>Country:</strong> {selectedOrder.shippingAddress.country}
                </p>
              </div>
            </>
          )}

          {selectedOrder.notes && (
            <>
              <h3>Notes</h3>
              <div style={{ marginBottom: '20px' }}>
                <p>{selectedOrder.notes}</p>
              </div>
            </>
          )}

          <div
            style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}
          >
            <Button
              onClick={() =>
                selectedOrder?.id && handleUpdateOrderStatus(selectedOrder.id, 'Completed')
              }
            >
              Mark Completed
            </Button>
            <Button
              onClick={() =>
                selectedOrder?.id && handleUpdateOrderStatus(selectedOrder.id, 'Cancelled')
              }
            >
              Cancel Order
            </Button>
            <Button onClick={() => setSelectedOrder(null)}>Close</Button>
          </div>
        </ModalContent>
      </OrderDetailsModal>
    );
  };

  // Handle updating order status
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    if (confirm(`Are you sure you want to mark this order as ${status}?`)) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        });

        if (response.ok) {
          fetchOrders();
          setSelectedOrder(null);
          alert(`Order marked as ${status}`);
        } else {
          alert('Failed to update order status');
        }
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }
  };

  // Render orders table
  const renderOrdersTable = () => (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id?.toString() || order.id}>
                <td>{(order._id?.toString() || order.id || '').slice(0, 6)}...</td>
                <td>
                  {order.customerName} <br />
                  <small>{order.email}</small>
                </td>
                <td>{order.items.length} items</td>
                <td>${order.totalAmount.toLocaleString()}</td>
                <td>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor:
                        order.status === 'Completed'
                          ? '#4caf50'
                          : order.status === 'Cancelled'
                            ? '#f44336'
                            : order.status === 'Processing'
                              ? '#2196f3'
                              : '#ff9800',
                      color: 'white',
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <Button onClick={() => setSelectedOrder(order)}>View Details</Button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      {selectedOrder && renderOrderModal()}
    </>
  );

  // Handle updating payment status
  const handleUpdatePaymentStatus = async (paymentId: string, status: string) => {
    if (confirm(`Are you sure you want to mark this payment as ${status}?`)) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/payments/${paymentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        });

        if (response.ok) {
          fetchPayments();
          setSelectedPayment(null);
          alert(`Payment marked as ${status}`);
        } else {
          alert('Failed to update payment status');
        }
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
    }
  };

  // Handle viewing payment receipt
  const handleViewReceipt = (paymentId: string) => {
    window.open(`/admin/payments/receipt?paymentId=${paymentId}`, '_blank');
  };

  // Render payment details modal
  const renderPaymentModal = () => {
    if (!selectedPayment) return null;

    return (
      <OrderDetailsModal onClick={() => setSelectedPayment(null)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <h2>Payment Details</h2>

          <div style={{ marginBottom: '20px' }}>
            <p>
              <strong>Payment ID:</strong> {selectedPayment._id}
            </p>
            <p>
              <strong>Order ID:</strong>{' '}
              <a
                href={`/admin/orders/${selectedPayment.orderId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedPayment.orderId}
              </a>
            </p>
            <p>
              <strong>User:</strong>{' '}
              {selectedPayment.user
                ? `${selectedPayment.user.firstName} ${selectedPayment.user.lastName} (${selectedPayment.user.email})`
                : 'User details not available'}
            </p>
            <p>
              <strong>Amount:</strong> {selectedPayment.currency}{' '}
              {selectedPayment.amount.toLocaleString()}
            </p>
            <p>
              <strong>Payment Method:</strong> {selectedPayment.paymentMethod}
            </p>
            <p>
              <strong>Status:</strong>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  margin: '0 10px',
                  borderRadius: '4px',
                  backgroundColor:
                    selectedPayment.status === 'completed'
                      ? '#4caf50'
                      : selectedPayment.status === 'failed'
                        ? '#f44336'
                        : selectedPayment.status === 'refunded'
                          ? '#ff9800'
                          : selectedPayment.status === 'processing'
                            ? '#2196f3'
                            : '#9e9e9e',
                  color: 'white',
                }}
              >
                {selectedPayment.status}
              </span>
            </p>
            <p>
              <strong>Date:</strong> {new Date(selectedPayment.createdAt).toLocaleString()}
            </p>
            {selectedPayment.completedAt && (
              <p>
                <strong>Completed Date:</strong>{' '}
                {new Date(selectedPayment.completedAt).toLocaleString()}
              </p>
            )}
          </div>

          {selectedPayment.paymentDetails && (
            <>
              <h3>Payment Details</h3>
              <div style={{ marginBottom: '20px' }}>
                {selectedPayment.paymentMethod === 'credit_card' && (
                  <>
                    <p>
                      <strong>Card Type:</strong>{' '}
                      {selectedPayment.paymentDetails.cardBrand || 'N/A'}
                    </p>
                    <p>
                      <strong>Last 4 digits:</strong>{' '}
                      {selectedPayment.paymentDetails.cardLast4 || 'N/A'}
                    </p>
                  </>
                )}
                {selectedPayment.paymentMethod === 'bank_transfer' && (
                  <>
                    <p>
                      <strong>Bank:</strong> {selectedPayment.paymentDetails.bankName || 'N/A'}
                    </p>
                    <p>
                      <strong>Reference:</strong>{' '}
                      {selectedPayment.paymentDetails.transferReference || 'N/A'}
                    </p>
                  </>
                )}
                {selectedPayment.transactionId && (
                  <p>
                    <strong>Transaction ID:</strong> {selectedPayment.transactionId}
                  </p>
                )}
              </div>
            </>
          )}

          <div
            style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}
          >
            {selectedPayment.status !== 'completed' && (
              <Button onClick={() => handleUpdatePaymentStatus(selectedPayment._id, 'completed')}>
                Mark Completed
              </Button>
            )}
            {selectedPayment.status !== 'failed' && (
              <Button onClick={() => handleUpdatePaymentStatus(selectedPayment._id, 'failed')}>
                Mark Failed
              </Button>
            )}
            {selectedPayment.status === 'completed' && (
              <Button onClick={() => handleUpdatePaymentStatus(selectedPayment._id, 'refunded')}>
                Mark Refunded
              </Button>
            )}
            <Button onClick={() => handleViewReceipt(selectedPayment._id)}>View Receipt</Button>
            <Button onClick={() => setSelectedPayment(null)}>Close</Button>
          </div>
        </ModalContent>
      </OrderDetailsModal>
    );
  };

  // Render payments table
  const renderPaymentsTable = () => (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Order ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment._id.toString().slice(0, 6)}...</td>
                <td>{payment.orderId.slice(0, 6)}...</td>
                <td>
                  {payment.user
                    ? `${payment.user.firstName} ${payment.user.lastName}`
                    : 'User Info N/A'}
                </td>
                <td>
                  {payment.currency} {payment.amount.toLocaleString()}
                </td>
                <td>{payment.paymentMethod}</td>
                <td>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor:
                        payment.status === 'completed'
                          ? '#4caf50'
                          : payment.status === 'failed'
                            ? '#f44336'
                            : payment.status === 'refunded'
                              ? '#ff9800'
                              : payment.status === 'processing'
                                ? '#2196f3'
                                : '#9e9e9e',
                      color: 'white',
                    }}
                  >
                    {payment.status}
                  </span>
                </td>
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button onClick={() => setSelectedPayment(payment)}>View Details</Button>
                  <Button onClick={() => handleViewReceipt(payment._id)}>Receipt</Button>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center' }}>
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      {selectedPayment && renderPaymentModal()}
    </>
  );

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
        <Tab active={activeTab === 'carts'} onClick={() => setActiveTab('carts')}>
          Carts
        </Tab>
        <Tab active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
          Orders
        </Tab>
        <Tab active={activeTab === 'payments'} onClick={() => setActiveTab('payments')}>
          Payments
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
      ) : activeTab === 'carts' ? (
        renderCartsTable()
      ) : activeTab === 'orders' ? (
        renderOrdersTable()
      ) : activeTab === 'payments' ? (
        renderPaymentsTable()
      ) : (
        <p>Orders management coming soon...</p>
      )}
    </AdminContainer>
  );
}
