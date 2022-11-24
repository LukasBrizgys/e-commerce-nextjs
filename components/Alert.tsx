import { Transition } from "@headlessui/react";
import { useEffect } from "react";
import { AlertType } from "../src/enums/alert.enums";
import { useAppDispatch, useAppSelector } from "../src/hooks/reduxWrapperHooks";
import { closeAlert, selectAlert } from "../src/store/alertSlice";

const Alert = () => {
    const alertState = useAppSelector(selectAlert);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const timer = setTimeout(() => {dispatch(closeAlert())}, 3000);
        return () => {
            clearTimeout(timer);
        }
    }, [alertState])
    
    return (
        <Transition show={alertState.show}
            className=
                {
                    `flex fixed bottom-5 left-5 items-center p-4 space-x-4 w-full max-w-xs rounded-lg divide-x divide-gray-200 shadow space-x
                     ${alertState.type === AlertType.success ? 'border-green-300 bg-green-100 text-green-600' : ''}
                     ${alertState.type === AlertType.warning ? 'border-yellow-300 bg-yellow-100 text-yellow-600' : ''}
                     ${alertState.type === AlertType.failure ? 'border-red-300 bg-red-100 text-red-600' : ''}
                    `
                } 
            role="alert"
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
        >
            <div id="toast-bottom-left" className="flex justify-center items-center gap-2">
            {
              alertState.type === AlertType.success &&
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="green" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            }
            {
                alertState.type === AlertType.warning &&
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="orange" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            }
            {
                alertState.type === AlertType.failure &&
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>

            }


                <div className="text-md font-medium">{alertState.message}</div>
            </div>
        </Transition>
    )
}
export default Alert;