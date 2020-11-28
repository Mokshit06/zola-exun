import { Avatar, Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import useAuth from 'hooks/useAuth';
import { Message as IMessage } from 'interfaces';
import { forwardRef } from 'react';

const Message = forwardRef<HTMLDivElement, IMessage>((props, ref) => {
  const { user } = useAuth();
  const { from, body } = props;
  const fromMe = from.id === user.id;
  const cardColor = useColorModeValue('#edf2f7', '#ffffff14');

  return (
    <Box
      p={2}
      display='flex'
      m={3}
      ref={ref}
      flexDirection={fromMe ? 'row-reverse' : 'row'}
    >
      <Avatar src={from.image} name={from.image} />
      <Box
        mr={fromMe && 4}
        ml={!fromMe && 4}
        bgColor={cardColor}
        px={4}
        pt={2}
        pb={3}
        borderRadius={5}
      >
        <Flex
          wordBreak='break-word'
          maxWidth='400px'
          flexDir='column'
          alignItems={fromMe ? 'flex-end' : 'flex-start'}
        >
          <Text fontWeight='semibold' fontSize='md'>
            {fromMe ? 'You' : from.name}
          </Text>
          <Text>{body}</Text>
        </Flex>
      </Box>
    </Box>
  );
});

export default Message;
