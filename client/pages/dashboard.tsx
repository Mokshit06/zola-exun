import { Box, IconButton } from '@chakra-ui/react';
import { Auth } from 'components/Auth';
import Appliances from 'components/Dashboard/Appliances';
import Class from 'components/Dashboard/Class';
import Weather from 'components/Dashboard/Weather';
import useSpeechRecognition from 'contexts/SpeechProvider';
import { MdMic, MdMicOff } from 'react-icons/md';

function Dashboard() {
  const { recognition, isRecording } = useSpeechRecognition();

  const handleRecordClick = () => {
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <div>
      <Weather />
      <Appliances />
      <Class />
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

export default Auth(Dashboard);
