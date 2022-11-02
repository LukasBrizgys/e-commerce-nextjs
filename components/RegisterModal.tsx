import { Fragment, useRef, useState} from "react";
import { useAppDispatch, useAppSelector } from "../src/hooks/reduxWrapperHooks";
import { closeModal, selectModal } from "../src/store/modalSlice";
import { registerSchema } from "../src/validation/registrationSchema";
import { useFormik } from 'formik';
import { Dialog, Transition } from "@headlessui/react";
import { ModalType } from "../src/enums/modal.enums";
import TextField from "./TextField";
import axios from 'axios';
import Loader from "./Loader";
const RegisterModal = () => {
    const dispatch = useAppDispatch();
    const modal = useAppSelector(selectModal);
    const completeButtonRef = useRef(null);
    const [loading, setIsLoading] = useState<boolean>(false);
    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            email: '',
            password: '',
            passwordRepeat: '',
            birthDate: '',
            consent:''
        },
        validationSchema: registerSchema,
        onSubmit: async(values) => {
          if(formik.isValid) {
            setIsLoading(true);
            try{
              await axios.post('/api/register' , values, {
                headers:{
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Cache-Control': 'no-cache, no-store'
                }
              })
              dispatch(closeModal());
              formik.resetForm();
            }catch(error) {
              if(axios.isAxiosError(error) && error.response?.status === 422) {
                formik.errors = error.response.data;
              }
              if(axios.isAxiosError(error) && error.response?.status === 409) {
                  formik.errors.email = 'Šis El. Paštas jau egzistuoja';
              }
            }finally{
              setIsLoading(false);
            }
            
          }
            
        }
    })
    return (
        <Transition.Root show={modal.type === ModalType.register && modal.open} as={Fragment}>
      <Dialog as="div" initialFocus={completeButtonRef} className="relative z-10" onClose={() => dispatch(closeModal())}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel as="form" action="/api/register" method="POST" encType="application/x-www-form-urlencoded" onSubmit={formik.handleSubmit} className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex items-center justify-center">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium text-center leading-6 text-gray-900">
                        Registracija
                      </Dialog.Title>
                      <div className="mt-2 flex justify-center">
                        <div className="flex gap-3 w-screen sm:w-full justify-center sm:justify-between items-center flex-col sm:flex-row sm:flex-wrap sm:items-baseline">
                            <TextField
                                type='text'
                                name='name'
                                label='Vardas'
                                handleBlur={formik.handleBlur}
                                handleChange={formik.handleChange}
                                value={formik.values.name}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.errors.name}
                            />
                            <TextField
                                type='text'
                                name='surname'
                                label='Pavardė'
                                handleBlur={formik.handleBlur}
                                handleChange={formik.handleChange}
                                value={formik.values.surname}
                                error={formik.touched.surname && Boolean(formik.errors.surname)}
                                helperText={formik.errors.surname}
                            />

                            <TextField
                                type='text'
                                name='email'
                                label='El. Paštas'
                                handleBlur={formik.handleBlur}
                                handleChange={formik.handleChange}
                                value={formik.values.email}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.errors.email}
                            />

                            <TextField
                                type='password'
                                name='password'
                                label='Slaptažodis'
                                handleBlur={formik.handleBlur}
                                handleChange={formik.handleChange}
                                value={formik.values.password}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.errors.password}
                            />

                            <TextField
                                type='password'
                                name='passwordRepeat'
                                label='Pakartokite slaptažodį'
                                handleBlur={formik.handleBlur}
                                handleChange={formik.handleChange}
                                value={formik.values.passwordRepeat}
                                error={formik.touched.passwordRepeat && Boolean(formik.errors.passwordRepeat)}
                                helperText={formik.errors.passwordRepeat}
                            />

                            <TextField
                                type='text'
                                name='birthDate'
                                label='Gimimo data'
                                handleBlur={formik.handleBlur}
                                handleChange={formik.handleChange}
                                value={formik.values.birthDate}
                                error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
                                helperText={formik.errors.birthDate}
                            />
                            <div className="flex items-center mb-4">
                              <input id="consent-checkbox" type="checkbox" name="consent" value={formik.values.consent} onBlur={formik.handleBlur} onChange={formik.handleChange} className={Boolean(formik.errors.consent) ? "w-4 h-4 text-red-600 accent-red-600 bg-red-600 rounded-md border-red-600" : "w-4 h-4 text-teal-600 bg-gray-100 rounded-md border-gray-300"}/>
                              <label htmlFor="consent-checkbox" className={Boolean(formik.errors.consent) ? "ml-2 text-lg text-red-600" : "ml-2 text-lg text-gray-900"}>Sutinku su taisyklėmis</label>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex-row-reverse sm:px-6 sm:flex sm:justify-evenly">
                  
                  <button
                    ref={completeButtonRef}
                    disabled={loading}
                    type="submit"
                    className="mb-2 h-12 sm:mb-0 sm:px-8 flex w-full justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-600 sm:mt-0 sm:ml-3 sm:w-32 sm:h-10 sm:text-sm"
                  >
                    {loading ? <Loader/> : <span>Registruotis</span>}
                  </button>
                  <button
                    type="button"
                    className="mt-2 h-12 sm:mt-0 sm:px-8 inline-flex w-full justify-center items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-32 sm:h-10 sm:text-sm"
                    onClick={() => {dispatch(closeModal()); formik.resetForm()}}
                  >
                    Atšaukti
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    )
}
export default RegisterModal;