import { Category } from '@prisma/client'
import { createClient, PostgrestResponse } from '@supabase/supabase-js'
import type { GetServerSideProps, GetServerSidePropsContext, NextPage, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
export const getServerSideProps : GetServerSideProps = async(ctx : GetServerSidePropsContext) => {
  const supabase = createClient(process.env.NEXT_SUPABASE_API_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: categories } : PostgrestResponse<Category> = await supabase.from('Category').select('*');
  return {
    props: {
      categories
    }
  }
}
const Home: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>
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
