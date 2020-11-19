import { Box, Button, Heading, IconButton } from '@chakra-ui/react';
import useSpeechRecognition from 'contexts/SpeechProvider';
import { Meeting } from 'interfaces';
import api from 'lib/axios';
import { useState } from 'react';
import { MdMic, MdMicOff } from 'react-icons/md';

export default function Dashboard() {
  const [url, setURL] = useState('');
  const { recognition, isRecording } = useSpeechRecognition();

  const handleRecordClick = () => {
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  async function createMeeting() {
    const { data: meeting } = await api.post<Meeting>('/api/meetings', {});
    const url = `${window.location.origin}/meeting/${meeting.code}`;
    setURL(url);
  }

  return (
    <div>
      <Heading>Dashboard</Heading>
      <Button onClick={createMeeting}>Create meeting</Button>
      {url}
      <Box pos='absolute' bottom='30px' right='30px'>
        <IconButton
          onClick={handleRecordClick}
          size='lg'
          fontSize={25}
          isRound
          aria-label='Say something'
          icon={isRecording ? <MdMicOff /> : <MdMic />}
        />
      </Box>
    </div>
  );
}
