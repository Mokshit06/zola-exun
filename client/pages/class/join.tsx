import { Box, Button, Flex, Heading, Input, useToast } from '@chakra-ui/react';
import FormField from 'components/FormField';
import { Form, Formik, FormikHelpers } from 'formik';
import { useClass } from 'hooks/api-hooks';
import useAuth from 'hooks/useAuth';
import { ApiResponse, Class } from 'interfaces';
import api from 'lib/axios';
import { ClassJoinSchema } from 'lib/form-schema';
import Router from 'next/router';

export default function JoinClass() {
  return (
    <Flex flex={1} width='full' alignItems='center' justifyContent='center'>
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
          <Heading>Join your class</Heading>
        </Box>

        <Box mt={4}>
          <JoinClassForm />
        </Box>
      </Box>
    </Flex>
  );
}

function JoinClassForm() {
  const { user } = useAuth();
  const toast = useToast();
  const { mutate, data } = useClass();

  const initialValues = {
    code: '',
  };

  type InitialValues = typeof initialValues;

  const handleSubmit = async (
    values: InitialValues,
    { setSubmitting }: FormikHelpers<InitialValues>
  ) => {
    if (!user || user.isTeacher) {
      return;
    }

    try {
      const { data: classData } = await api.post<ApiResponse>(
        '/api/class/join',
        {
          code: values.code,
        }
      );

      await mutate();

      toast({
        title: classData.message,
        description: `Logging you into your class!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      Router.push('/dashboard');
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
      validationSchema={ClassJoinSchema}
    >
      {({ isSubmitting, isValid }) => (
        <Form>
          <FormField name='code' label='Enter Class Code'>
            {({ field }) => <Input placeholder='Your code' {...field} />}
          </FormField>
          <Box mt={6} mb={4} textAlign='left'>
            <Button
              isLoading={isSubmitting}
              disabled={isSubmitting || !isValid}
              type='submit'
              width='full'
              py={6}
            >
              Join
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
