import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { Auth } from 'components/Auth';
import { NextChakraLink } from 'components/Link';
import { useMeetings } from 'hooks/api-hooks';
import { DateTime } from 'luxon';
import Head from 'next/head';

function Attendence() {
  const { data: meetings } = useMeetings();
  const hoverColor = useColorModeValue('#edf2f7', '#ffffff14');
  const selectedColor = useColorModeValue('#E2E8F0', '#ffffff29');

  return (
    <Flex width='full' flex={1} alignItems='center' justifyContent='center'>
      <Head>Attendence | Zola</Head>
      <Box
        borderWidth={1}
        p={8}
        width='full'
        maxWidth={['380px', null, null, '430px', null]}
        borderRadius={4}
        textAlign='center'
        boxShadow='lg'
      >
        <Box my={2} textAlign='center'>
          <Heading>Attendence</Heading>
        </Box>
        <VStack mt={7} spacing={3}>
          {meetings?.length > 0 ? (
            meetings.map(meeting => (
              <Box width='full'>
                <NextChakraLink
                  py={3}
                  px={4}
                  bgColor={hoverColor}
                  _hover={{ bgColor: selectedColor }}
                  borderRadius={3}
                  display='flex'
                  justifyContent='space-between'
                  href={`/attendance/${meeting.code}`}
                  width='full'
                >
                  <Text>
                    {DateTime.fromISO(meeting.createdAt).toFormat('DDD')}
                  </Text>
                  <Text>
                    {DateTime.fromISO(meeting.createdAt).toFormat('t')}
                  </Text>
                </NextChakraLink>
              </Box>
            ))
          ) : (
            <Text fontSize='lg'>No meetings created yet</Text>
          )}
        </VStack>
      </Box>
    </Flex>
  );
}

export default Auth(Attendence, { isTeacher: true });
