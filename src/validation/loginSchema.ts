import * as yup from 'yup';
export const loginSchema = yup.object({
    email: yup.string()
    .email('Įveskite tinkamą el. paštą')
    .required('Įveskite el. paštą'),
    password: yup
    .string()
    .required('Įveskite slaptažodį')
})