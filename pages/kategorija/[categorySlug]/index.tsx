import { useState, useEffect} from 'react'
import { Category } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestResponse } from "@supabase/postgrest-js";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCategoryComponentsBySlug } from "../../../src/db/queries/component.queries";
import Head from 'next/head';
import CatalogItem from '../../../components/CatalogItem';
import { FullComponent } from '../../../src/types/Component.types';
export const getServerSideProps : GetServerSideProps = async(ctx : GetServerSidePropsContext) => {
    const supabase = createServerSupabaseClient(ctx);
    const { data: categories, error: categoryError } : PostgrestResponse<Category> = await supabase.from('Category').select('*');
    const components : FullComponent[] | null = await getCategoryComponentsBySlug(ctx.params!.categorySlug!.toString());
    if(components) {
      return {
        props: {
          categories,
          components: components
        }
    }
    }
    return {
      props: {
        categories
      }
    }
    
  }
  
const Catalog = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [components, setComponents] = useState([]);
  useEffect(() => {
    setComponents(props.components);
  },[props.components])

  return (
      <>
        <Head>
            <title>Katalogas</title>
            <meta property="og:title" content="Katalogas" key="title"/>
        </Head>
        <div className="flex justify-between">
          <div className="basis-14 fixed">
              <h3>Filtrai</h3>
          </div>
          <div className="flex justify-center gap-4 flex-wrap items-stretch">
            {
              components && components.map((component : FullComponent) => 
              (<CatalogItem key={component.id} component={component}/>))
            }
          </div>
        </div>
      </> 
  )
}
export default Catalog;