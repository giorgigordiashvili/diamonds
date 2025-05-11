'use client';

import { getDictionary } from '@/get-dictionary';
import styled from 'styled-components';
import UsersTable from './UsersTable'; // Import UsersTable

const Container = styled.div`
  padding: 20px;
  color: #e0e0e0; // Light gray text for readability on black background
  background-color: #000000; // Black background
  border-radius: 8px; // Rounded corners for the container
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); // Subtle shadow
`;

// Styled component for the title
const TabTitle = styled.h2`
  font-size: 24px; // Consistent with AdminDashboardClient Title
  font-weight: 500; // Medium weight
  color: #ffffff; // White title
  margin-bottom: 20px; // Add some space below the title
`;

interface UsersTabProps {
  adminDict: Awaited<ReturnType<typeof getDictionary>>['admin'];
  lang: string; // Add lang prop
}

export default function UsersTab({ adminDict, lang }: UsersTabProps) {
  return (
    <Container>
      <TabTitle>{adminDict.tabs.users}</TabTitle>
      <UsersTable adminDict={adminDict} lang={lang} />
    </Container>
  );
}
