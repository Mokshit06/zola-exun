import { Button, Heading, useDisclosure } from '@chakra-ui/react';
import { Meeting } from 'interfaces';
import api from 'lib/axios';
import { useState } from 'react';

export default function Dashboard() {
  const [url, setURL] = useState('');
  const { isOpen, onOpen } = useDisclosure();

  async function createMeeting() {
    const { data: meeting } = await api.post<Meeting>('/api/meetings', {});

    const url = `${window.location.origin}/meeting/${meeting.code}`;
    console.log(url);

    setURL(url);
    onOpen();
  }

  return (
    <div>
      <Heading>Dashboard</Heading>
      <Button onClick={createMeeting}>Create meeting</Button>
      {url}
    </div>
  );
}
