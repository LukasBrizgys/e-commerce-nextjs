import { Category } from '@prisma/client'
import { createClient, PostgrestResponse } from '@supabase/supabase-js'
import type { GetServerSideProps, GetServerSidePropsContext, NextPage, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css';
import crypto from 'crypto';
import { getCookie, setCookie} from 'cookies-next';
export const getServerSideProps : GetServerSideProps = async(ctx : GetServerSidePropsContext) => {
  const supabase = createClient(process.env.NEXT_SUPABASE_API_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const sessionCookie = getCookie('sessionId', ctx);
  if(!sessionCookie) {
    let expiryDate = new Date();
    const month = (expiryDate.getMonth() + 1) % 12;
    expiryDate.setMonth(month);
    setCookie('sessionId', crypto.randomUUID(),{ req:ctx.req, res:ctx.res, expires: expiryDate, httpOnly:true, sameSite:'lax', path:'/*'});
  }
  const { data: categories } : PostgrestResponse<Category> = await supabase.from('Category').select('*');
  return {
    props: {
      categories
    }
  }
}
const Home: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className={styles.container}>
      <Head>
        
        <title>Kompiuterio komponentų El. parduotuvė</title>
        <meta property="og:title" content="Kompiuterio komponentų El. parduotuvė" key="title" />
        <meta charSet='UTF-8'/>
        <meta name="description" content="Kompiuterio komponentų El. parduotuvė" />
      </Head>
    </div>
  )
}

export default Home
