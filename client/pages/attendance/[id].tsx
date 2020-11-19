import { Box, Checkbox, Flex, Heading, Text } from '@chakra-ui/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/Table';
import { useClass, useSingleMeeting } from 'hooks/api-hooks';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';

export default function SingleAttendence() {
  const router = useRouter();
  const { id: meetingId } = router.query;
  const { data: meeting, error } = useSingleMeeting(meetingId as string);
  const { data: userClass } = useClass();

  if (error) return 'Error';

  if (!userClass || !meeting) return <div />;

  return (
    <Flex flex={1} width='full' justifyContent='center'>
      <Box mt={4} maxW='90vw' w='1000px'>
        <Heading py={6} mb={2}>
          Attendence of {DateTime.fromISO(meeting.createdAt).toFormat('DDD')}
        </Heading>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>S. No.</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Joined at</TableHeader>
              <TableHeader>Present</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {userClass.students.map((student, index) => {
              const isPresent = !!meeting?.studentsPresent.find(
                u => u.user.id === student.id
              );

              return (
                <TableRow
                  key={student.id}
                  bg={!(index % 2) ? 'white' : 'gray.50'}
                >
                  <TableCell>
                    <Text fontSize='md' color='gray.500'>
                      {index + 1}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text fontSize='md'>{student.name}</Text>
                  </TableCell>
                  <TableCell>
                    <Text fontSize='md'>{student.email}</Text>
                  </TableCell>
                  <TableCell>
                    <Text fontSize='md' color='gray.500'>
                      19 November
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text fontSize='md' color='gray.500'>
                      <Checkbox
                        size='lg'
                        isDisabled
                        defaultIsChecked={isPresent}
                      />
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