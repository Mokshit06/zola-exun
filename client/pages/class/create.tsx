import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Auth } from 'components/Auth';
import ShareModal from 'components/Class/ShareModal';
import FormField from 'components/FormField';
import { Form, Formik, FormikHelpers } from 'formik';
import useAuth from 'hooks/useAuth';
import { ApiResponse } from 'interfaces';
import api from 'lib/axios';
import { ClassSchema } from 'lib/form-schema';
import Head from 'next/head';
import Router from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';

export default Auth(CreateClass, { isTeacher: true });

function CreateClass() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [code, setCode] = useState('');

  return (
    <Flex flex={1} width='full' alignItems='center' justifyContent='center'>
      <Head>
        <title>Create Class | Prisma</title>
      </Head>
      <ShareModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          Router.push('/');
        }}
        code={code}
      />
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
  const toast = useToast();
  const initialValues = {
    grade: 9,
    section: 'A',
  };

  type InitialValues = typeof initialValues;

  const handleSubmit = async (
    values: InitialValues,
    { setSubmitting }: FormikHelpers<InitialValues>
  ) => {
    if (!user) {
      return;
    }

    try {
      const { data } = await api.post<ApiResponse<{ code: string }>>(
        '/api/class',
        {
          grade: values.grade,
          section: values.section,
        }
      );

      toast({
        title: 'Class created',
        description: 'Your class has been created!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setCode(data.code);
      setOpen(true);
    } catch (error) {
      const errorText = error?.response?.data?.message || error;

      toast({
        title: errorText,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    setSubmitting(false);
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
