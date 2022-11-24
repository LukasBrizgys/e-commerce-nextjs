import '../styles/globals.css'
import Layout from '../components/Layout';
import React, { PropsWithChildren, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { Category } from '@prisma/client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { createBrowserSupabaseClient, Session } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { NextRouter, useRouter } from 'next/router';
import { NextComponentType, NextPageContext } from 'next';
import { AppPropsType } from 'next/dist/shared/lib/utils';
import { AppProps } from 'next/app';
interface CustomAppProps {
  Component : NextComponentType<NextPageContext<any>>;
  pageProps : any;
  categories: Category[];
  userEmail?: string;
  initialSession: Session,
  appProps:PropsWithChildren<AppPropsType<NextRouter, {}>>;
}
const DynamicLoginModal = dynamic(() => import('../components/LoginModal'), { suspense:true, ssr:true });
const DynamicRegisterModal = dynamic(() => import('../components/RegisterModal'), { suspense: true, ssr:true})
function MyApp({ Component, pageProps} : AppProps<CustomAppProps>) {
  const [ supabaseClient ] = useState(() => createBrowserSupabaseClient());
  const router = useRouter();
  const getGlobalLayout = () => {
    if(['/checkout/success', '/checkout'].includes(router.pathname)) return <Component {...pageProps}/>
    return (
      <Layout categories={pageProps.categories}>
          <Component {...pageProps}/>{" "}
      </Layout>
    )
    }
  return (
    <>
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      <Provider store={store}>
        {getGlobalLayout()}
        <Suspense fallback={<Loader/>}>
          <DynamicLoginModal/>
        </Suspense>
        <Suspense fallback={<Loader/>}>
          <DynamicRegisterModal/>
        </Suspense>
        <Alert/>
      </Provider>
    </SessionContextProvider>
    </>
  )
  
}

export default MyApp;
