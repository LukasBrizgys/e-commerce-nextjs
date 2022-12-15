import React, { Fragment, useState } from "react";
import Cart from "./Cart";
import Link from "next/link";
import { useAppDispatch } from "../src/hooks/reduxWrapperHooks";
import { openModal } from "../src/store/modalSlice";
import { ModalType } from "../src/enums/modal.enums";
import { useUser } from "@supabase/auth-helpers-react";
import { Menu, Transition } from "@headlessui/react";
import axios from 'axios';
const UserMenuBar = () => {
    const dispatch = useAppDispatch();
    const user = useUser();
    const [openCart, setOpenCart] = useState<boolean>(false);
    const [cartQuantity, setCartQuantity] = useState<number>(0);
    const handleLogout = () => {
        axios.post('/api/logout').then(() => {
            window.location.reload();
        })
        
    }
    return (
        <>
            <div className="right-0 flex-wrap flex gap-6 items-center justify-center pr-2 py-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                <Link href="/suderinamumas" className="text-gray-900 h-10 text-lg font-medium hover:bg-teal-100 hover:bg-opacity-40 flex justify-center items-center px-3 py-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                    Suderinamumas
                </Link>
            
            <div className="relative flex justify-center">

            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" className="w-5 h-5 text-gray-600 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input type="search" id="product-search" className="block p-2 px-10 text-md text-gray-500 bg-white rounded-lg border border-gray-300 focus:ring-gray-500 focus:border-gray-500 dark:bg-white dark:border-500 placeholder:text-gray-700 dark:focus:ring-gray-500 dark:focus:border-gray-500" placeholder="Ieškoti prekių..."/>
            </div>
            <div className="flex">
            <div className="flex  items-center">
                {!user && 
                <>
                <button onClick={() => dispatch(openModal(ModalType.login))} className="text-gray-900 flex h-10 hover:bg-teal-100 hover:bg-opacity-40 justify-center items-center px-3 py-2 rounded-md text-lg font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                    Prisijungti
                    </button>
                <button onClick={() => dispatch(openModal(ModalType.register))} className="text-gray-900  h-10 hover:bg-teal-100 hover:bg-opacity-40 flex justify-center items-center px-3 py-2 rounded-md text-lg font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Registruotis
                    </button>
                
                </>    
                }
                {
                    user &&
                    <>
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="relative gap-1 text-gray-900 h-10 hover:bg-teal-100 hover:bg-opacity-40 flex justify-center items-center px-3 py-2 rounded-md text-lg font-medium">
                {user.user_metadata.name}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
          >
          <Menu.Items className="absolute left-0 sm:left-auto sm:right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                  <button
                    className='hover:bg-teal-100 hover:bg-opacity-40 group flex w-full items-center rounded-md px-2 py-2 text-md font-medium'>
                    Profilis
                  </button>
              </Menu.Item>
              <Menu.Item>
                  <button
                    className='hover:bg-teal-100 hover:bg-opacity-40 group flex w-full items-center rounded-md px-2 py-2 text-md font-medium'
                  >
                    Užsakymai
                  </button> 
              </Menu.Item>
              { user?.role === 'service_role' &&
                <Menu.Item>
                    <Link href="/admin/dashboard/" legacyBehavior prefetch={false}>
                        <a className="hover:bg-teal-100 hover:bg-opacity-40 group flex w-full items-center rounded-md px-2 py-2 text-md font-medium">
                        Administratoriaus meniu
                        </a>
                    </Link>

                </Menu.Item>
                }
            </div>
          </Menu.Items>
        </Transition>
        </Menu>
                            <button onClick={() => handleLogout()} className="text-gray-900  h-10 hover:bg-teal-100 hover:bg-opacity-40 flex justify-center items-center px-3 py-2 rounded-md text-lg font-medium">
                                Atsijungti
                            </button>
                    </>
                }
            </div>
            <div className="relative">
                <div onClick={() => setOpenCart(!openCart)} className={openCart ? "relative cursor-pointer bg-teal-100 bg-opacity-40 p-5 rounded-full" : "relative cursor-pointer p-5 rounded-full"}>
                    <span className="absolute left-8 top-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-sm">{cartQuantity}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                </div>

                    <Cart className="relative" open={openCart} setOpen={setOpenCart} setCartQuantity={setCartQuantity}/>
            </div> 
            
            </div> 
        </div>
       </>
       
    )
}
export default UserMenuBar;