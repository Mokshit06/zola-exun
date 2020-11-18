import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { Field } from 'formik';

interface FormFieldProps {
  name: string;
  label: string;
  children: ({ field, form, meta }) => JSX.Element;
}

export default function FormField({ name, label, children }: FormFieldProps) {
  return (
    <Field name={name}>
      {({ field, form, meta }) => {
        return (
          <FormControl mt={4} isInvalid={meta.touched && meta.error}>
            <FormLabel>{label}</FormLabel>
            {children({ field, form, meta })}
            <FormErrorMessage>{meta.error}</FormErrorMessage>
          </FormControl>
        );
      }}
    </Field>
  );
}
