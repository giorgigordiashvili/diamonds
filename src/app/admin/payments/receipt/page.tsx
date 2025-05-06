'use client';

import { setCookie } from 'cookies-next';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled components
const ReceiptContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background: #fff;
  color: #333;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  position: relative;
`;

const PrintButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }

  @media print {
    display: none;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 8px 16px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }

  @media print {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  align-items: center;
`;

const BusinessInfo = styled.div`
  text-align: left;
`;

const BusinessName = styled.h1`
  font-size: 24px;
  margin-bottom: 5px;
`;

const BusinessContact = styled.div`
  font-size: 14px;
`;

const ReceiptInfo = styled.div`
  text-align: right;
`;

const ReceiptTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ReceiptNumber = styled.div`
  margin-bottom: 5px;
`;

const ReceiptDate = styled.div``;

const CustomerInfo = styled.div`
  margin-bottom: 30px;
  padding: 15px;
  background: #f9f9f9;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
  margin-bottom: 10px;
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;

  th,
  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
  }
`;

const TotalSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 30px;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 250px;
  margin-bottom: 5px;
`;

const TotalLabel = styled.div<{ bold?: boolean }>`
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
`;

const TotalValue = styled.div<{ bold?: boolean }>`
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
`;

const PaymentMethod = styled.div`
  margin-bottom: 30px;
`;

const Footer = styled.div`
  margin-top: 50px;
  text-align: center;
  font-size: 14px;
  color: #666;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 50px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 50px;
  color: #f44336;
`;

// Wrapper component that uses hooks
function ReceiptContent() {
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setIsAuthenticated] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams ? searchParams.get('paymentId') : null;

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          setError('Authentication required');
          setLoading(false);
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

        setIsAuthenticated(true);

        // Now fetch the receipt
        fetchReceipt(token);
      } catch (error) {
        console.error('Auth error:', error);
        setError('Authentication failed');
        setLoading(false);
      }
    };

    checkAuth();
  }, [paymentId]);

  // Fetch receipt data
  const fetchReceipt = async (token: string) => {
    try {
      if (!paymentId) {
        setError('Payment ID is required');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/payments/receipt?paymentId=${paymentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch receipt');
      }

      const data = await response.json();
      setReceipt(data);
    } catch (error) {
      console.error('Error fetching receipt:', error);
      setError(error instanceof Error ? error.message : 'Failed to load receipt');
    } finally {
      setLoading(false);
    }
  };

  // Handle print button click
  const handlePrint = () => {
    window.print();
  };

  // Handle back button click
  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return <LoadingMessage>Loading receipt...</LoadingMessage>;
  }

  if (error) {
    return (
      <ErrorMessage>
        <h2>Error</h2>
        <p>{error}</p>
        <BackButton onClick={handleBack}>Back</BackButton>
      </ErrorMessage>
    );
  }

  if (!receipt) {
    return <ErrorMessage>Receipt not found</ErrorMessage>;
  }

  return (
    <ReceiptContainer>
      <PrintButton onClick={handlePrint}>Print Receipt</PrintButton>
      <BackButton onClick={handleBack}>Back</BackButton>

      <Header>
        <BusinessInfo>
          <BusinessName>{receipt.businessInfo.name}</BusinessName>
          <BusinessContact>
            {receipt.businessInfo.email}
            <br />
            {receipt.businessInfo.phone}
            <br />
            {receipt.businessInfo.website}
            <br />
            {receipt.businessInfo.address}
          </BusinessContact>
        </BusinessInfo>

        <ReceiptInfo>
          <ReceiptTitle>RECEIPT</ReceiptTitle>
          <ReceiptNumber>Receipt #: {receipt.receiptNumber}</ReceiptNumber>
          <ReceiptDate>Date: {new Date(receipt.date).toLocaleDateString()}</ReceiptDate>
        </ReceiptInfo>
      </Header>

      <CustomerInfo>
        <SectionTitle>Customer Information</SectionTitle>
        <div>
          <strong>Name:</strong> {receipt.customer.name}
          <br />
          <strong>Email:</strong> {receipt.customer.email}
          <br />
          <strong>Address:</strong>
          <br />
          {typeof receipt.customer.address === 'string' ? (
            receipt.customer.address
          ) : (
            <>
              {receipt.customer.address.street}
              <br />
              {receipt.customer.address.city}, {receipt.customer.address.state}{' '}
              {receipt.customer.address.postalCode}
              <br />
              {receipt.customer.address.country}
            </>
          )}
        </div>
      </CustomerInfo>

      <SectionTitle>Purchased Items</SectionTitle>
      <ItemsTable>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items.map((item: any, index: number) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{formatCurrency(item.price, receipt.paymentDetails.currency)}</td>
              <td>{item.quantity}</td>
              <td>{formatCurrency(item.total, receipt.paymentDetails.currency)}</td>
            </tr>
          ))}
        </tbody>
      </ItemsTable>

      <TotalSection>
        <TotalRow>
          <TotalLabel>Subtotal:</TotalLabel>
          <TotalValue>
            {formatCurrency(receipt.subtotal, receipt.paymentDetails.currency)}
          </TotalValue>
        </TotalRow>
        {receipt.tax > 0 && (
          <TotalRow>
            <TotalLabel>Tax:</TotalLabel>
            <TotalValue>{formatCurrency(receipt.tax, receipt.paymentDetails.currency)}</TotalValue>
          </TotalRow>
        )}
        {receipt.shipping > 0 && (
          <TotalRow>
            <TotalLabel>Shipping:</TotalLabel>
            <TotalValue>
              {formatCurrency(receipt.shipping, receipt.paymentDetails.currency)}
            </TotalValue>
          </TotalRow>
        )}
        <TotalRow>
          <TotalLabel bold>Total:</TotalLabel>
          <TotalValue bold>
            {formatCurrency(receipt.total, receipt.paymentDetails.currency)}
          </TotalValue>
        </TotalRow>
      </TotalSection>

      <PaymentMethod>
        <SectionTitle>Payment Details</SectionTitle>
        <div>
          <div>
            <strong>Payment Method:</strong>{' '}
            {receipt.paymentMethod
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </div>
          <div>
            <strong>Status:</strong>{' '}
            {receipt.paymentDetails.status.replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </div>
          {receipt.paymentDetails.cardBrand && receipt.paymentDetails.cardLast4 && (
            <div>
              <strong>Card:</strong> {receipt.paymentDetails.cardBrand} ending in{' '}
              {receipt.paymentDetails.cardLast4}
            </div>
          )}
          {receipt.paymentDetails.transactionId && (
            <div>
              <strong>Transaction ID:</strong> {receipt.paymentDetails.transactionId}
            </div>
          )}
        </div>
      </PaymentMethod>

      <Footer>
        <p>Thank you for your business!</p>
        <p>
          Order ID: {receipt.orderId} • Payment ID: {receipt.paymentId}
        </p>
      </Footer>
    </ReceiptContainer>
  );
}

// Main page component with Suspense boundary
export default function ReceiptPage() {
  return (
    <Suspense fallback={<LoadingMessage>Loading receipt...</LoadingMessage>}>
      <ReceiptContent />
    </Suspense>
  );
}
