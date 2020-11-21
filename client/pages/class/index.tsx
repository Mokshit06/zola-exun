import {
  Avatar,
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
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
import Head from 'next/head';

function ClassPage() {
  const { data: userClass } = useClass();

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const lightColor = useColorModeValue('white', 'gray.600');
  const textColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Flex flex={1} width='full' justifyContent='center'>
      <Head>
        <title>
          Class {userClass?.grade}
          {userClass?.section} | Zola
        </title>
      </Head>
      <Box mt={4} maxW='90vw' w='1000px'>
        <Heading py={6} mb={2}>
          Class {userClass?.grade}
          {userClass?.section}
        </Heading>
        <Text fontWeight={500} fontSize='lg' mb={4}>
          Teacher: {userClass?.teacher.name}
        </Text>
        <Table>
          <TableHead bgColor={bgColor}>
            <TableRow>
              <TableHeader>S. No.</TableHeader>
              <TableHeader>Avatar</TableHeader>
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
                    <Avatar src={student.image} size='sm' name={student.name} />
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
