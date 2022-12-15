import { Category } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestResponse } from "@supabase/supabase-js";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";

export const getServerSideProps : GetServerSideProps = async(ctx : GetServerSidePropsContext) => {
    const supabase = createServerSupabaseClient(ctx);
    const { data: categories, error: categoryError } : PostgrestResponse<Category> = await supabase.from('Category').select('*');
    console.log(categories);
    return {
        props: {
            categories
        }
    }
}
const AdminDashboard = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <>
            <Head>
            <title>Admin panelė</title>
            <meta property="og:title" content="Katalogas" key="title"/>
            </Head>
            
        </>
    )
}
export default AdminDashboard;