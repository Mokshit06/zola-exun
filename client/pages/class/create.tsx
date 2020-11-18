import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import ShareModal from 'components/Class/ShareModal';
import FormField from 'components/FormField';
import { Form, Formik, FormikHelpers } from 'formik';
import useAuth from 'hooks/useAuth';
import { ApiResponse } from 'interfaces';
import api from 'lib/axios';
import { ClassSchema } from 'lib/class-schema';
import { Dispatch, SetStateAction, useState } from 'react';

export default function CreateClass() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [code, setCode] = useState('');

  return (
    <Flex flex={1} width='full' alignItems='center' justifyContent='center'>
      <ShareModal isOpen={isOpen} onClose={onClose} code={code} />
      <Box
        borderWidth={1}
        p={8}
        width='full'
        maxWidth={['360px', null, null, '430px', null]}
        borderRadius={4}
        textAlign='center'
        boxShadow='lg'
      >
        <Box my={2} textAlign='center'>
          <Heading>Create your class</Heading>
        </Box>

        <Box mt={4}>
          <CreateClassForm setOpen={onOpen} setCode={setCode} />
        </Box>
      </Box>
    </Flex>
  );
}

interface CreateClassFormProps {
  setCode: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function CreateClassForm({ setCode, setOpen }: CreateClassFormProps) {
  const { user } = useAuth();
  const initialValues = {
    grade: 9,
    section: 'A',
  };

  type InitialValues = typeof initialValues;

  const handleSubmit = async (
    values: InitialValues,
    { setSubmitting }: FormikHelpers<InitialValues>
  ) => {
    if (!user || !user.isTeacher) {
      return;
    }

    const { data } = await api.post<ApiResponse<{ code: string }>>(
      '/api/class',
      {
        grade: values.grade,
        section: values.section,
      }
    );

    setSubmitting(false);
    setCode(data.code);
    setOpen(true);
  };

  return (
    <Formik<InitialValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={ClassSchema}
    >
      {({ isSubmitting, isValid }) => (
        <Form>
          <FormField name='grade' label='Grade'>
            {({ field }) => (
              <Select placeholder='Select the grade' {...field}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField name='section' label='Section'>
            {({ field }) => (
              <Select placeholder='Select the grade' {...field}>
                {['A', 'B', 'C', 'D'].map(section => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <Box mt={6} mb={4} textAlign='left'>
            <Button
              isLoading={isSubmitting}
              disabled={isSubmitting || !isValid}
              type='submit'
              width='full'
              py={6}
            >
              Create
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
