import '../styles/globals.css'
import Layout from '../components/Layout';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { AppProps } from 'next/app';
import { Category } from '@prisma/client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { createBrowserSupabaseClient, Session } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import Loader from '../components/Loader';
interface CustomAppProps {
  categories: Category[],
  initialSession : Session
}
const DynamicLoginModal = dynamic(() => import('../components/LoginModal'), { suspense:true });
const DynamicRegisterModal = dynamic(() => import('../components/RegisterModal'), { suspense: true })
function MyApp({ Component, pageProps} : any) {
  const [ supabaseClient ] = useState(() => createBrowserSupabaseClient());
  useEffect(() => {
    const getSessionCookie = async() => {
      await fetch('/api/session',{method:'post'})
    }
    getSessionCookie();
  }, [])
  return (
    <>
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      <Provider store={store}>
        <Layout categories={pageProps.categories}>
              <Component {...pageProps}/>{" "}
        </Layout>
        <Suspense fallback={<Loader/>}>
          <DynamicLoginModal/>
        </Suspense>
        <Suspense fallback={<Loader/>}>
          <DynamicRegisterModal/>
        </Suspense>
      </Provider>
    </SessionContextProvider>  
    </>
  )
  
}

export default MyApp;
