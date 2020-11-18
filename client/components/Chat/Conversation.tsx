import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react';
import useChats from 'contexts/ChatsProvider';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import Message from './Message';

export default function Conversation() {
  const { selectedRoom, sendMessage, messages } = useChats();
  const [isInvalid, setIsInvalid] = useState(false);
  const [text, setText] = useState('');
  const scrollDownRef = useRef<HTMLDivElement>();

  useEffect(() => {
    scrollDownRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSubmit = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!text.trim()) {
      setIsInvalid(true);
      return;
    }

    setIsInvalid(false);
    sendMessage(text);
    setText('');
    scrollDownRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Flex flexDir='column' width='full' height='calc(100vh - 82px)'>
      <Box flex={1} overflowY='auto'>
        {messages.map(message => {
          return <Message key={message.id} {...message} />;
        })}
      </Box>
      <Box m={3}>
        <Flex as='form' onSubmit={handleSubmit}>
          <FormControl mr={4} isInvalid={isInvalid} ref={scrollDownRef}>
            <Input
              size='lg'
              placeholder='Your message...'
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <FormErrorMessage>
              {isInvalid && 'Message is required'}
            </FormErrorMessage>
          </FormControl>
          <Button leftIcon={<FaPaperPlane />} size='lg' type='submit'>
            Send
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
