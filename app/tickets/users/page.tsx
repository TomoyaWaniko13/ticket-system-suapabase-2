import { IconCheck, IconUserOff } from '@tabler/icons-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// P.85 Implementing a user overview

const users = [
  {
    name: 'Harry Green',
    job: 'QA Engineer',
    isAvailable: false,
  },
  {
    name: 'Trudy Torres',
    job: 'Project Manager',
    isAvailable: true,
  },
  {
    name: 'Alice Ling',
    job: 'Software Engineer',
    isAvailable: false,
  },
];

export default function UserList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Job</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow>
            <TableCell className={`${!user.isAvailable && 'text-red-500'}`}>
              {user.isAvailable ? <IconCheck /> : <IconUserOff />}
              {user.name}
            </TableCell>
            <TableCell>{user.job}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
