import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { useFormik } from 'formik';
import React, { Fragment, useRef, useState } from "react";
import { ModalType } from "../src/enums/modal.enums";
import { useAppDispatch, useAppSelector } from "../src/hooks/reduxWrapperHooks";
import { closeModal, selectModal } from "../src/store/modalSlice";
import { loginSchema } from "../src/validation/loginSchema";
import Loader from "./Loader";
import TextField from "./TextField";

interface ILoginFailed {
  status: string,
  message: string
}
interface ILoginValidationFailed {
  email? : string
  password? : string
}
const LoginModal = () => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const modal = useAppSelector(selectModal);
    const completeButtonRef = useRef(null);
    const formik = useFormik({
        initialValues : {
            email: '',
            password: '',
        },
        validationSchema:loginSchema,
        onSubmit: async(values) => {
            if(formik.isValid) {
              setLoading(true);
              try{
                await axios.post('/api/login', values, {
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cache-Control': 'no-cache, no-store'
                  }
                })
                location.reload();
              }catch(error) {
                console.log(error);
                if(axios.isAxiosError<ILoginValidationFailed>(error) && error.response?.status === 422) {
                  formik.errors.email = error.response.data?.email;
                  formik.errors.password = error.response.data?.password;
                }
                if(axios.isAxiosError<ILoginFailed>(error) && error.response?.status === 401) {
                  formik.errors.email = error.response?.data.message;
                }
              }finally{
                setLoading(false);
              }
            }
        }
    })
    return(
    <Transition.Root show={modal.type === ModalType.login && modal.open} as={Fragment}>
      <Dialog as="div" initialFocus={completeButtonRef} className="relative z-10" onClose={() => {dispatch(closeModal()); formik.resetForm()}}>
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
              <Dialog.Panel as="form" method="POST" encType="application/x-www-form-urlencoded" onSubmit={formik.handleSubmit} className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex items-center justify-center">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium text-center leading-6 text-gray-900">
                        Prisijungimas
                      </Dialog.Title>
                      <div className="mt-2 flex justify-center">
                        <div className="flex w-screen justify-between sm:justify-center flex-col sm:flex-row items-center sm:gap-10">
                            <TextField
                                type='text'
                                name='email'
                                label='El. paštas'
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
                    className="mb-2 h-12 sm:mb-0 sm:px-8 inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-600 sm:mt-0 sm:ml-3 sm:w-32 sm:h-10 sm:text-sm"
                  >
                    {loading ? <Loader/> : 'Prisijungti'}
                  </button>
                  <button
                    type="button"
                    className=" mt-2 h-12 sm:mt-0 sm:px-8 inline-flex w-full justify-center items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-32 sm:h-10 sm:text-sm"
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
export default LoginModal;