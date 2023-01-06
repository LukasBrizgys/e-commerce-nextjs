import { Category } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestResponse } from "@supabase/supabase-js";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Carousel from "../../../components/Carousel";
import { getComponentBySlug } from "../../../src/db/queries/component.queries";
import { getComponentPricesBySlug } from "../../../src/db/queries/pricing.queries";

export const getServerSideProps : GetServerSideProps = async(ctx : GetServerSidePropsContext) => {
    const supabase = createServerSupabaseClient(ctx);
    const { data: categories, error: categoryError } : PostgrestResponse<Category> = await supabase.from('Category').select('*');
    const slug = ctx.params?.componentSlug?.toString();
    const [component, prices] = await Promise.all([getComponentBySlug(slug), getComponentPricesBySlug(slug)])
    if(!component) return { props: {}, redirect:{ basePath:'/', permanent: false } }
    console.log(component);
    return {
        props: {
            categories,
            component: JSON.parse(JSON.stringify(
                component,
                (key, value) => (typeof value === 'bigint' ? value.toString() : value))),
            prices: JSON.parse(JSON.stringify(
                prices,
                (key, value) => (typeof value === 'bigint' ? value.toString() : value)))
        }
    }
}

const ComponentPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    <>
        <Head>
            <title>{props.component.name}</title>
            <meta property="og:title" content="Komponento detalės" key="title"/>
        </Head>
        <div>
            <div className="w-full">
                <div>
                    
                </div>
            </div>
        </div>
    </>

}
export default ComponentPage;