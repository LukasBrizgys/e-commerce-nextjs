import { useState, useEffect } from 'react'
import { Category } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestResponse } from "@supabase/postgrest-js";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { findComponents, findMaxPriceInCategory } from "../../../src/db/queries/component.queries";
import Head from 'next/head';
import CatalogItem from '../../../components/CatalogItem';
import { FullComponent } from '../../../src/types/Component.types';
import Slider from '../../../components/Slider';
import Loader from '../../../components/Loader';
import { useRouter } from 'next/router';
export const getServerSideProps : GetServerSideProps = async(ctx : GetServerSidePropsContext) => {
    const supabase = createServerSupabaseClient(ctx);
    let minPrice : number | undefined;
    let maxPrice : number | undefined;
    let brand : string[] | undefined;

    if(ctx.query.minPrice) minPrice = parseInt(ctx.query.minPrice.toString()) * 100;
    if(ctx.query.maxPrice) maxPrice = parseInt(ctx.query.maxPrice.toString()) * 100;
    if(ctx.query.brand) brand = ctx.query.brand.toString().split(','); 
    const maxCategoryPrice = await findMaxPriceInCategory(ctx.params?.categorySlug?.toString()!);
    const { data: categories, error: categoryError } : PostgrestResponse<Category> = await supabase.from('Category').select('*');
    const components : FullComponent[] | null = await findComponents({
      categorySlug:ctx.params?.categorySlug?.toString(),
      minPrice:minPrice,
      maxPrice: maxPrice,
      brand: brand
    });
    if(components) {
      return {
        props: {
          categories,
          ...(minPrice && {minPrice}),
          ...(maxPrice && {maxPrice}),
          maxCategoryPrice,
          components: JSON.parse(JSON.stringify(
            components,
            (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
          ))
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number>(props.minPrice / 100);
  const [maxPrice, setMaxPrice] = useState<number>(props.maxPrice / 100);
  const router = useRouter();
  const refreshData = () => {
      router.replace({
      query:{...router.query, minPrice:minPrice, maxPrice:maxPrice}
    });
  }

  useEffect(() => {
    setIsLoading(false);
  },[props.components]);

  useEffect(() => {
    refreshData();
    setIsLoading(true);
  },[minPrice,maxPrice]);
  return (
      <>
        <Head>
            <title>Katalogas</title>
            <meta property="og:title" content="Katalogas" key="title"/>
        </Head>
        <div className="flex">
          <div className="mt-12 mx-5 flex  flex-col items-center p-10 bg-gray-100 rounded-md self-start">
              <Slider min={0} max={Math.ceil(props.maxCategoryPrice / 100)} currentMax={maxPrice} setMinPrice={setMinPrice} setMaxPrice={setMaxPrice}/>
          </div>
          <div className="flex gap-6 justify-center flex-wrap items-stretch">
            {
              props.components && !isLoading && props.components.map((component : FullComponent) => 
              (<CatalogItem key={component.id} component={component}/>))
            }
            {
              isLoading && <Loader className="w-20 h-20  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
            }
          </div>
        </div>
      </> 
  )
}
export default Catalog;