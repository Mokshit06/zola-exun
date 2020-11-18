import * as yup from 'yup';

export const ClassSchema = yup.object().shape({
  grade: yup
    .number()
    .typeError('Invalid Grade')
    .required('Grade is required')
    .min(1)
    .max(12),
  section: yup
    .string()
    .typeError('Invalid Section')
    .required('Section is required'),
});
