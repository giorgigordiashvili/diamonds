'use client';

import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Diamond } from '@/types/diamond';
import { Order, OrderStatus } from '@/types/order';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  color: #e0e0e0; // Light gray text for readability on black background
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
    padding: 12px 15px; // Adjusted padding
    text-align: left;
    color: #e0e0e0; // Light text for table content
  }

  th {
    background-color: #222; // Darker header background
    color: #ffffff; // White text for headers
    font-weight: 600;
  }
  tr:hover {
    background-color: #1a1a1a; // Slightly lighter black for hover
  }
`;

const ViewDetailsButton = styled.button`
  color: #6bbaff; // Light blue for links
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: #8cceff; // Brighter blue on hover
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7); // Darker overlay
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background-color: #1a1a1a; // Dark background for modal
  padding: 25px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
  color: #e0e0e0; // Light text for modal content

  h1,
  h2,
  h3 {
    color: #ffffff; // White titles in modal
  }

  p strong {
    color: #f0f0f0; // Slightly brighter for emphasized text
  }

  table {
    th {
      background-color: #2a2a2a; // Darker header for tables within modal
      color: #ffffff;
      border-bottom: 1px solid #444;
    }
    td {
      border-bottom: 1px solid #444;
      color: #d0d0d0;
    }
    tbody tr:hover {
      background-color: #252525;
    }
  }
`;

const CloseButton = styled.button`
  background: #555; // Medium gray for close button
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  float: right;
  margin-bottom: 15px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background: #777; // Lighter gray on hover
  }
`;

const fetchOrders = async (lang: Locale): Promise<Order[]> => {
  console.log(`Fetching all orders for lang ${lang}`);
  const mockOrders: Order[] = [
    {
      _id: 'order123',
      user: {
        name: 'Alice Smith',
        email: 'alice@example.com',
        role: 'user',
        createdAt: new Date(),
        password: '',
        firstName: '',
        lastName: '',
        updatedAt: new Date(),
      },
      items: [
        {
          diamond: {
            id: 'd1',
            name_en: 'Diamond A',
            name_ka: 'ალმასი A',
            shape: 'Brilliant',
            carat: 1,
            color: 'D',
            clarity: 'IF',
            cut: 'Excellent',
            polish: 'Excellent',
            symmetry: 'Excellent',
            fluorescence: 'None',
            certificate: 'GIA',
            price: 5000,
            image: '/assets/diamonds/brilliant.png',
          },
          quantity: 1,
          price: 5000,
        },
      ],
      totalAmount: 5000,
      status: OrderStatus.Processing,
      shippingAddress: {
        address: '123 Main St',
        city: 'Anytown',
        postalCode: '12345',
        country: 'USA',
      },
      createdAt: new Date(Date.now() - 86400000 * 2),
      updatedAt: new Date(),
    },
    {
      _id: 'order456',
      guestCheckoutInfo: { email: 'bob@example.com', name: 'Bob Johnson' },
      items: [
        {
          diamond: {
            id: 'd2',
            name_en: 'Diamond B',
            name_ka: 'ალმასი B',
            shape: 'Emerald',
            carat: 0.75,
            color: 'E',
            clarity: 'VVS1',
            cut: 'Very Good',
            polish: 'Very Good',
            symmetry: 'Very Good',
            fluorescence: 'None',
            certificate: 'IGI',
            price: 3000,
            image: '/assets/diamonds/emerald.png',
          },
          quantity: 2,
          price: 6000,
        },
      ],
      totalAmount: 6000,
      status: OrderStatus.Shipped,
      shippingAddress: {
        address: '456 Oak Ave',
        city: 'Otherville',
        postalCode: '67890',
        country: 'USA',
      },
      createdAt: new Date(Date.now() - 86400000 * 5),
      updatedAt: new Date(Date.now() - 86400000 * 1),
    },
  ];
  return new Promise((resolve) => setTimeout(() => resolve(mockOrders), 1000));
};

const updateOrderStatusInModal = async (
  orderId: string,
  status: OrderStatus,
  lang: Locale
): Promise<boolean> => {
  console.log(`Updating order ${orderId} to status ${status} for lang ${lang} from modal`);
  return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
};

interface OrdersTabProps {
  adminDict: Awaited<ReturnType<typeof getDictionary>>['admin'];
  lang: Locale;
}

export default function OrdersTab({ adminDict, lang }: OrdersTabProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusUpdateModalOpen, setIsStatusUpdateModalOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState<OrderStatus>(OrderStatus.Pending);
  const [loadingStatusUpdate, setLoadingStatusUpdate] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchOrders(lang)
      .then(setOrders)
      .catch(() => setError(adminDict.ordersTable.noOrdersFound))
      .finally(() => setLoading(false));
  }, [lang, adminDict.ordersTable.noOrdersFound]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleOpenStatusUpdateModal = (currentStatus: OrderStatus) => {
    setStatusToUpdate(currentStatus);
    setIsStatusUpdateModalOpen(true);
  };

  const handleCloseStatusUpdateModal = () => {
    setIsStatusUpdateModalOpen(false);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setLoadingStatusUpdate(true);
    try {
      const orderIdStr =
        typeof selectedOrder._id === 'string' ? selectedOrder._id : selectedOrder._id.toString();
      const success = await updateOrderStatusInModal(orderIdStr, statusToUpdate, lang);
      if (success) {
        const updatedOrder = { ...selectedOrder, status: statusToUpdate };
        setSelectedOrder(updatedOrder);
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o._id === selectedOrder._id ? updatedOrder : o))
        );
        setIsStatusUpdateModalOpen(false);
      } else {
        alert(adminDict.alerts.orderStatusUpdateFailed);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert(adminDict.alerts.orderStatusUpdateFailed);
    } finally {
      setLoadingStatusUpdate(false);
    }
  };

  if (loading && !selectedOrder) return <p>{adminDict.loading}</p>;
  if (error) return <p>{error}</p>;

  const d = adminDict.ordersTable;
  const od = adminDict.orderDetails;
  const commonD = adminDict;

  const getCustomerName = (order: Order) => {
    if (order.user) return order.user.name || order.user.email;
    if (order.guestCheckoutInfo)
      return order.guestCheckoutInfo.name || order.guestCheckoutInfo.email;
    return 'N/A';
  };

  const getStatusText = (status: OrderStatus) => {
    const statusKey = status.toLowerCase() as keyof typeof od.status;
    return od.status[statusKey] || status;
  };

  const getDiamondName = (diamond: Diamond) => {
    return lang === 'ka' ? diamond.name_ka : diamond.name_en;
  };

  return (
    <Container>
      <h2 className="text-2xl font-semibold mb-4">{adminDict.tabs.orders}</h2>
      {orders.length === 0 && !loading ? (
        <p>{d.noOrdersFound}</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>{d.headerId}</th>
              <th>{d.headerCustomer}</th>
              <th>{d.headerItems}</th>
              <th>{d.headerTotal}</th>
              <th>{d.headerStatus}</th>
              <th>{d.headerDate}</th>
              <th>{d.headerActions}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={typeof order._id === 'string' ? order._id : order._id.toString()}>
                <td>{typeof order._id === 'string' ? order._id : order._id.toString()}</td>
                <td>{getCustomerName(order)}</td>
                <td>
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} {d.itemsSuffix}
                </td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{getStatusText(order.status)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <ViewDetailsButton onClick={() => handleViewDetails(order)}>
                    {d.viewDetailsAction}
                  </ViewDetailsButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {isModalOpen && selectedOrder && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseModal}>{commonD.closeButton || 'Close'}</CloseButton>
            <h1 className="text-2xl font-bold mb-6 text-white">
              {od.title} -{' '}
              {typeof selectedOrder._id === 'string'
                ? selectedOrder._id
                : selectedOrder._id.toString()}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-gray-800 p-6 rounded-lg shadow">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-white">
                  {od.orderIdLabel}{' '}
                  {typeof selectedOrder._id === 'string'
                    ? selectedOrder._id
                    : selectedOrder._id.toString()}
                </h2>
                <p className="text-gray-300">
                  <strong className="text-gray-100">{od.customerLabel}</strong>{' '}
                  {getCustomerName(selectedOrder)}
                </p>
                {selectedOrder.user?.email && (
                  <p className="text-gray-300">
                    <strong className="text-gray-100">{od.customerEmailLabel}</strong>{' '}
                    {selectedOrder.user.email}
                  </p>
                )}
                {!selectedOrder.user && selectedOrder.guestCheckoutInfo?.email && (
                  <p className="text-gray-300">
                    <strong className="text-gray-100">{od.customerEmailLabel}</strong>{' '}
                    {selectedOrder.guestCheckoutInfo.email}
                  </p>
                )}
                <p className="text-gray-300">
                  <strong className="text-gray-100">{od.orderDateLabel}</strong>{' '}
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-300">
                  <strong className="text-gray-100">{od.orderStatusLabel}</strong>{' '}
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${selectedOrder.status === OrderStatus.Delivered ? 'bg-green-700 text-green-100' : 'bg-yellow-700 text-yellow-100'}`}
                  >
                    {getStatusText(selectedOrder.status)}
                  </span>
                </p>
                <p className="text-gray-300">
                  <strong className="text-gray-100">{od.totalAmountLabel}</strong>$
                  {selectedOrder.totalAmount.toFixed(2)}
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => handleOpenStatusUpdateModal(selectedOrder.status)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                  >
                    {od.updateStatusButton}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2 text-white">{od.shippingAddressLabel}</h3>
                <p className="text-gray-300">{selectedOrder.shippingAddress?.address}</p>
                <p className="text-gray-300">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
                </p>
                <p className="text-gray-300">{selectedOrder.shippingAddress?.country}</p>
              </div>
              {selectedOrder.billingAddress && (
                <div className="bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {od.billingAddressLabel}
                  </h3>
                  <p className="text-gray-300">{selectedOrder.billingAddress.address}</p>
                  <p className="text-gray-300">
                    {selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.postalCode}
                  </p>
                  <p className="text-gray-300">{selectedOrder.billingAddress.country}</p>
                </div>
              )}
            </div>

            <div className="mb-6 bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4 text-white">{od.itemsTable.title}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-750">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {od.itemsTable.headerImage}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {od.itemsTable.headerName}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {od.itemsTable.headerShape}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {od.itemsTable.headerCarat}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {od.itemsTable.headerPrice}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {od.itemsTable.headerQuantity}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {od.itemsTable.headerTotal}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {selectedOrder.items.map((item, index) => (
                      <tr
                        key={
                          (item.diamond._id?.toString() || item.diamond.id || index) + '-modalitem'
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.diamond.image && (
                            <Image
                              src={item.diamond.image}
                              alt={getDiamondName(item.diamond)}
                              width={50}
                              height={50}
                              className="object-cover rounded"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                          {getDiamondName(item.diamond)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {item.diamond.shape}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {item.diamond.carat}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          ${item.diamond.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedOrder.paymentDetails && (
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-white">{od.paymentDetails.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-gray-300">
                    <strong className="text-gray-100">{od.paymentDetails.paymentIdLabel}</strong>{' '}
                    {selectedOrder.paymentDetails.paymentId}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-gray-100">
                      {od.paymentDetails.paymentMethodLabel}
                    </strong>{' '}
                    {selectedOrder.paymentDetails.paymentMethod}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-gray-100">
                      {od.paymentDetails.paymentStatusLabel}
                    </strong>{' '}
                    {selectedOrder.paymentDetails.paymentStatus}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-gray-100">
                      {od.paymentDetails.transactionIdLabel}
                    </strong>{' '}
                    {selectedOrder.paymentDetails.transactionId}
                  </p>
                </div>
              </div>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      {isStatusUpdateModalOpen && selectedOrder && (
        <ModalOverlay onClick={handleCloseStatusUpdateModal}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <CloseButton onClick={handleCloseStatusUpdateModal}>
              {commonD.closeButton || 'Close'}
            </CloseButton>
            <h3 className="text-2xl font-bold text-white mb-4">{od.updateStatusModal.title}</h3>
            <div className="mt-4">
              <label
                htmlFor="status-select-modal"
                className="block text-sm font-medium text-gray-200"
              >
                {od.updateStatusModal.newStatusLabel}
              </label>
              <select
                id="status-select-modal"
                value={statusToUpdate}
                onChange={(e) => setStatusToUpdate(e.target.value as OrderStatus)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>
            <div className="items-center px-4 py-3 mt-6 text-right">
              <button
                onClick={handleUpdateStatus}
                disabled={loadingStatusUpdate}
                className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loadingStatusUpdate ? commonD.loading : od.updateStatusModal.updateButton}
              </button>
              <button
                onClick={handleCloseStatusUpdateModal}
                className="ml-3 px-4 py-2 bg-gray-600 text-gray-100 text-base font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {od.updateStatusModal.cancelButton}
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
