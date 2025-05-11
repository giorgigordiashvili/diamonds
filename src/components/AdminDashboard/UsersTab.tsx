'use client';

import { getDictionary } from '@/get-dictionary';
import styled from 'styled-components';
import UsersTable from './UsersTable'; // Import UsersTable

const Container = styled.div`
  padding: 20px;
`;

interface UsersTabProps {
  adminDict: Awaited<ReturnType<typeof getDictionary>>['admin'];
  lang: string; // Add lang prop
}

export default function UsersTab({ adminDict, lang }: UsersTabProps) {
  return (
    <Container>
      <h2 className="text-2xl font-semibold mb-4">{adminDict.tabs.users}</h2>
      <UsersTable adminDict={adminDict} lang={lang} />
    </Container>
  );
}
