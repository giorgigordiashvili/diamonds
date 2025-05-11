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
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
`;

const Button = styled.button`
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  &:hover {
    background-color: #c82333;
  }
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
            <td>{user._id?.toString() || user.id}</td>
            <td>{`${user.firstName} ${user.lastName}`}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{new Date(user.createdAt).toLocaleDateString(lang)}</td>
            <td>
              {user.role !== 'admin' && (
                <Button onClick={() => handlePromoteUser(user._id?.toString() || user.id!)}>
                  {adminDict.usersTable.makeAdminAction}
                </Button>
              )}
              <DeleteButton onClick={() => handleDeleteUser(user._id?.toString() || user.id!)}>
                {adminDict.diamondsTable.deleteAction}
              </DeleteButton>
              {/* Add Edit button/functionality later */}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UsersTable;
