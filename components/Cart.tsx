import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../src/hooks/reduxWrapperHooks";
import useWindowDimensions from "../src/hooks/useWindowDimensions";
import { getCartItems, selectCart } from "../src/store/cartSlice";
import { CartComponent } from "../src/types/CartComponent.type";
import CartItem from "./CartItem";
import Loader from "./Loader";

interface CartProps  {
    open : boolean
    className : string
    setOpen : Dispatch<SetStateAction<boolean>>
    setCartQuantity : Dispatch<SetStateAction<number>>
}
const Cart = ({open, setOpen, setCartQuantity} : CartProps) => {
    const { height, width } = useWindowDimensions();
    const cartState = useAppSelector(selectCart);
    const dispatch = useAppDispatch();
    useEffect(() => {
      const fetchCartItems = async() => {
          await dispatch(getCartItems())
      }
      fetchCartItems();
    },[])
    useEffect(() => {
      setCartQuantity(cartState.totalQuantity);
    },[cartState.totalQuantity])
    return (
        <>
        
        <div className={open && width !== null && width > 1024 ? "absolute flex flex-col top-12 left-5" : 'hidden'}>
          
            <div className="absolute left-1 top-0 w-0 h-0 border-r-8 border-l-8 border-b-8 border-l-transparent border-r-transparent border-gray-200"></div>
            <Transition.Root
            className={open ? 'top-2 -left-36 z-10 bg-white border-x border-y rounded-md shadow-xl absolute' : 'hidden'}
            appear={true}
            show={open}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
            > 
              <div className="w-80 max-h-80  no-scrollbar overflow-y-scroll">

              
                {!cartState.loading && cartState.totalQuantity === 0 && <p className="text-center p-3">Šiuo metu krepšelis tuščias</p>}
                {cartState.loading && <Loader/>}
                {
                  cartState.loading === false && cartState.totalQuantity > 0 &&
                  cartState.components.map((component : CartComponent) => 
                    <CartItem key={component.componentId} component={component}/>
                  )
                }
              </div>
              { cartState.totalQuantity !== 0 &&
                <div className="flex flex-col justify-center bg-white border-y-2 p-3 gap-3">
                  <div className="self-end font-bold">Visa suma: {(cartState.totalPrice / 100).toFixed(2)}&euro;</div>
                  <Link href="/checkout/" className="flex items-center font-medium justify-center p-4 rounded-md h-10 bg-teal-600 w-64 self-center text-white">Pereiti į apmokėjimą</Link>
                </div>
                }
            </Transition.Root>
            
        </div>
    
    <Transition.Root show={open && width !== null && width <= 1024} as={Fragment} >
      <Dialog as="div" className="relative lg z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-lg font-medium text-gray-900">Krepšelis</Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                     <>
                      {!cartState.loading && cartState.totalQuantity === 0 && <p className="text-center p-3">Šiuo metu krepšelis tuščias</p>}
                      {cartState.loading && <Loader/>}
                      {
                        !cartState.loading && cartState.totalQuantity > 0 &&
                        cartState.components.map((component : CartComponent) => {
                          <CartItem key={component.componentId} component={component} mobile={true}/>
                      })
                      }
                    </>  
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    </>
    )
}
export default Cart;