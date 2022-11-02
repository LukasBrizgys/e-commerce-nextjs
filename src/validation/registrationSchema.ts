import * as yup from 'yup';
export const registerSchema = yup.object({
    name: yup
    .string()
    .trim()
    .min(3,'Vardą turi sudaryti bent 3 simboliai')
    .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u, 'Įveskite tinkamą vardą')
    .required('Įveskite vardą'),
    surname: yup
    .string()
    .trim()
    .min(3,'Pavardę turi sudaryti bent 3 simboliai')
    .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u, 'Įveskite tinkamą pavardę')
    .required('Įveskite pavardę'),
    email: yup
    .string()
    .email('Įveskite tinkamą el. paštą')
    .required('Įveskite el. paštą'),
    password: yup
    .string()
    .min(8, 'Slaptažodį turi sudaryti 8 ar daugiau simbolių')
    .matches(/(?=.*?[a-ząčęėįšųū])/,'Turi būti bent viena mažoji raidė')
    .matches(/(?=.*?[A-ZĄČĘĖĮŠŲŪ])/, 'Turi būti bent viena didžioji raidė')
    .matches(/(?=.*?[0-9])/, 'Turi būti bent vienas skaičius')
    .matches(/(?=.*?[.#?!@$%^&*-])/, 'Turi būti bent vienas simbolis')
    .required('Įveskite slaptažodį'),
    passwordRepeat: yup
    .string()
    .required('Pakartokite slaptažodį')
    .oneOf([yup.ref('password')], 'Nesutampa slaptažodžiai'),
    birthDate: yup
    .date()
    .nullable()
    .typeError('Įveskite tinkamą datą')
    .max(new Date(), 'Įveskite tinkamą datą')
    .required('Įveskite gimimo datą'),
    consent: yup
    .boolean().oneOf([true], 'Sutikite su taisyklėmis')
})