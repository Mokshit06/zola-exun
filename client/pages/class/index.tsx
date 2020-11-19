import { Box, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { Auth } from 'components/Auth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/Table';
import { useClass } from 'hooks/api-hooks';
import { DateTime } from 'luxon';

function ClassPage() {
  const { data: userClass } = useClass();

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const lightColor = useColorModeValue('white', 'gray.600');
  const textColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Flex flex={1} width='full' justifyContent='center'>
      <Box mt={4} maxW='90vw' w='1000px'>
        <Heading py={6} mb={2}>
          Class {userClass?.grade}
          {userClass?.section}
        </Heading>
        <Table>
          <TableHead bgColor={bgColor}>
            <TableRow>
              <TableHeader>S. No.</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Provider</TableHeader>
              <TableHeader>Joined At</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {userClass?.students.map((student, index) => {
              return (
                <TableRow
                  key={student.id}
                  bg={!(index % 2) ? lightColor : bgColor}
                >
                  <TableCell>
                    <Text fontSize='md' color={textColor}>
                      {index + 1}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text fontSize='md'>{student.name}</Text>
                  </TableCell>
                  <TableCell>
                    <Text fontSize='md' color={textColor}>
                      {student.email}
                    </Text>
                  </TableCell>

                  <TableCell>
                    <Text fontSize='md' color={textColor}>
                      {student.provider[0].toUpperCase()}
                      {student.provider.slice(1).toLowerCase()}
                    </Text>
                  </TableCell>

                  <TableCell>
                    <Text fontSize='md' color={textColor}>
                      {DateTime.fromISO(student.createdAt).toFormat('DDD')}
                    </Text>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Flex>
  );
}

export default Auth(ClassPage);
