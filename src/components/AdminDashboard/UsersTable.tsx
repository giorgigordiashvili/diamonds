'use client';

import { deleteUser, getAllUsers, promoteToAdmin } from '@/api/users';
import { getDictionary } from '@/get-dictionary';
import { User } from '@/types/user';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

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
    border-bottom: none; // Remove border for the last row
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
  margin-right: 8px; // Adjusted margin
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #0056b3; // Darker blue on hover
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545; // Red color for delete
  &:hover {
    background-color: #c82333; // Darker red on hover
  }
`;

const ActionButtonContainer = styled.div`
  display: flex;
  gap: 8px; // Space between buttons
`;

interface UsersTableProps {
  adminDict: Awaited<ReturnType<typeof getDictionary>>['admin'];
  lang: string;
}

const UsersTable: React.FC<UsersTableProps> = ({ adminDict, lang }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllUsers();
      setUsers(response.users);
    } catch (err) {
      setError(adminDict.alerts.userPromoteError); // Generic error, can be more specific
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [adminDict.alerts.userPromoteError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePromoteUser = async (userId: string) => {
    if (window.confirm(adminDict.alerts.confirmPromoteUser)) {
      try {
        await promoteToAdmin(userId);
        alert(adminDict.alerts.userPromotedSuccess);
        fetchUsers(); // Refresh users list
      } catch (err: any) {
        alert(
          `${adminDict.alerts.userPromoteFailed}: ${err.message || adminDict.alerts.userPromoteError}`
        );
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // Add a confirmation for delete if not present in dictionary or use a generic one
    if (
      window.confirm('Are you sure you want to delete this user? This action cannot be undone.')
    ) {
      try {
        await deleteUser(userId);
        // Add a success message from dictionary if available
        alert('User deleted successfully.');
        fetchUsers(); // Refresh users list
      } catch (err: any) {
        // Add a failed message from dictionary if available
        alert(`Failed to delete user: ${err.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) return <p>{adminDict.loading}</p>;
  if (error) return <p>{error}</p>;
  if (users.length === 0) return <p>{adminDict.usersTable.noUsersFound}</p>;

  return (
    <Table>
      <thead>
        <tr>
          <th>{adminDict.usersTable.headerId}</th>
          <th>{adminDict.usersTable.headerName}</th>
          <th>{adminDict.usersTable.headerEmail}</th>
          <th>{adminDict.usersTable.headerRole}</th>
          <th>{adminDict.usersTable.headerCreatedAt}</th>
          <th>{adminDict.usersTable.headerActions}</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id?.toString() || user.id}>
            <td>{user._id?.toString().slice(0, 8) || user.id?.slice(0, 8)}...</td>{' '}
            {/* Shorten ID display */}
            <td>{`${user.firstName} ${user.lastName}`}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{new Date(user.createdAt).toLocaleDateString(lang)}</td>
            <td>
              <ActionButtonContainer>
                {' '}
                {/* Group buttons */}
                {user.role !== 'admin' && (
                  <Button onClick={() => handlePromoteUser(user._id?.toString() || user.id!)}>
                    {adminDict.usersTable.makeAdminAction}
                  </Button>
                )}
                <DeleteButton onClick={() => handleDeleteUser(user._id?.toString() || user.id!)}>
                  {adminDict.diamondsTable.deleteAction}
                </DeleteButton>
              </ActionButtonContainer>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UsersTable;
