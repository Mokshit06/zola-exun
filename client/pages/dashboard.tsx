import { Box, IconButton, useColorModeValue } from '@chakra-ui/react';
import { Auth } from 'components/Auth';
import Appliances from 'components/Dashboard/Appliances';
import Class from 'components/Dashboard/Class';
import Weather from 'components/Dashboard/Weather';
import useSpeechRecognition from 'contexts/SpeechProvider';
import Head from 'next/head';
import { MdMic, MdMicOff } from 'react-icons/md';

function Dashboard() {
  const { recognition, isRecording } = useSpeechRecognition();
  const bgColor = useColorModeValue('#edf2f7', '#2c313d');

  const handleRecordClick = () => {
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <Box>
      <Head>Dashboard | Prisma</Head>
      <Weather />
      <Appliances />
      <Class />
      <Box pos='fixed' bottom='30px' right='30px'>
        <IconButton
          boxShadow='lg'
          onClick={handleRecordClick}
          size='lg'
          fontSize={25}
          bgColor={bgColor}
          isRound
          aria-label='Say something'
          icon={isRecording ? <MdMicOff /> : <MdMic />}
        />
      </Box>
    </Box>
  );
}

export default Auth(Dashboard);
