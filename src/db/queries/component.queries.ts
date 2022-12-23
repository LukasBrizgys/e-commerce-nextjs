import { IAttributes } from "../../../pages/suderinamumas";
import { FullComponent, FullComponentWithFeatures } from "../../types/Component.types";
import { prisma } from "../config/prismaConfig";
interface IBrandQuery {
    brandId:{
        equals:number
    }
}
interface ComponentFilterParams {
    categorySlug? : string,
    brand? : string[],
    minPrice? : number,
    maxPrice? : number
}
export const findMaxPriceInCategory = async(category : string) => {
    const currentDate = new Date();
    const components = await prisma.pricing.aggregate({
        _max:{
            price:true
        },
        where:{
            AND:[
                {Component:{
                    Category:{slug: category}

                }},
                {startDateTime:{lt:currentDate}},
                {endDateTime:{gt:currentDate}}
            ]
        },
        
    })
    return JSON.parse(JSON.stringify(
        components._max.price,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
      ));
}
export const findComponents = async(filterParams : ComponentFilterParams) => {
    const currentDate = new Date();
    const brandsArray : number[] = [];
    if(filterParams.brand) {
        filterParams.brand.forEach((id) => {
            brandsArray.push(parseInt(id))
        })
    }
    try{
        const components : FullComponent[] = await prisma.component.findMany({
            where:{
                
                AND:[
                    {
                        Pricing:
                        {
                        every:{
                                startDateTime:{ lt:currentDate },
                                endDateTime:{ gt:currentDate },
                                price:{
                                    gte:filterParams?.minPrice,
                                    lte:filterParams?.maxPrice
                                }
                            }
                    
                        }
                    },
                    {
                        brandId:{in:brandsArray.length === 0 ? undefined : brandsArray}
                    },
                    {
                        Category:{
                    slug:{
                        equals:filterParams?.categorySlug
                    },
                },
                    }
                ]
                },
            select:{
                id:true,
                name:true,
                slug:true,
                brandId:true,
                categoryId:true,
                stock: true,
                Brand: true,
                Category: true,
                ComponentPicture:{
                    take:1,
                    select:{
                        Picture:{
                            select:{name: true}
                        }
                    }
                },
                Pricing:{
                    select:{
                        originalPrice:true,
                        price:true
                    }
                }
            }
        })
        return JSON.parse(JSON.stringify(
            components,
            (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
          ));
    }catch(err) {
        console.log(err)
        return null;
    }
}
export const getCategoryComponentsBySlug = async(slug : string, minPrice? : number, maxPrice? : number, brand? : string[]) => {
    const currentDate = new Date();
    const brandQuery : IBrandQuery[] = [];
    if(brand) {
        brand.forEach((id) =>{
            brandQuery.push({ brandId: {equals:parseInt(id)}})
        })
    }
    try{
        const components : FullComponent[] = await prisma.component.findMany({
            where:{
                Category:{
                    slug:{
                        equals:slug
                    },
                },
                AND:[
                    {
                        Pricing:
                        {
                        every:{
                                startDateTime:{ lt:currentDate },
                                endDateTime:{ gt:currentDate },
                            }
                    
                        }
                    },
                    {
                        Pricing:{
                            every:{
                                price:{
                                    gte:minPrice,
                                    lte:maxPrice
                                }
                            }
                        }
                    },
                    ...brandQuery
                ]
                },
            select:{
                id:true,
                name:true,
                slug:true,
                brandId:true,
                categoryId:true,
                stock: true,
                Brand: true,
                Category: true,
                ComponentPicture:{
                    take:1,
                    select:{
                        Picture:{
                            select:{name: true}
                        }
                    }
                },
                Pricing:{
                    select:{
                        originalPrice:true,
                        price:true
                    }
                }
            }
        })
        return JSON.parse(JSON.stringify(
            components,
            (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
          ));
    }catch(err) {
        return null;
    }
}
export const getCompatibleIds = async(category : number, compatibilities : IAttributes) => {
    try{
        let query: {componentId: number}[] = [];
        const result : number[] = [];
        let compatibilityString : string = '';
        Object.entries(compatibilities).forEach((entry) => {
            if(entry[1]) compatibilityString += `*${entry[1]}*` + ' ';
        })
        compatibilityString = compatibilityString.trim().replace(/\s/g, ' | ');
        console.log(compatibilityString);
        query = compatibilityString === '' ? await prisma.$queryRaw`SELECT DISTINCT ON (ft."componentId") ft."componentId" FROM fulltext as ft
        WHERE ft."categoryId" = ${category}` :
        await prisma.$queryRaw`SELECT DISTINCT ON (ft."componentId") ft."componentId" FROM fulltext as ft
        WHERE tsv @@ to_tsquery(${compatibilityString}) AND ft."categoryId" = ${category}`;
        query.forEach((entry) => {
            result.push(entry.componentId)
        }) 

        return result;
    }catch(error){
        console.log(error);
    }
    
}
export const getComponentBySlug = async(slug : string | undefined) => {
    const currentDate = new Date();
    
    try{
        if(!slug) throw new Error('No Slug');
        const component = await prisma.component.findFirst({
            include:{
                Brand:true,
                Category:true,
                Pricing:{
                    take:1,
                    select:{
                        price:true,
                        originalPrice:true
                    }
                },
                
                ComponentPicture:{
                    select:{
                        Picture:{
                            select:{name:true}
                        }
                    }
                },
                ComponentFeature:{
                    select:{
                        Feature:{
                            select:{name:true}
                        },
                        value:true
                    }
                }
            },
            where:{
                AND:[
                    {Pricing:{every:{startDateTime:{lt:currentDate}, endDateTime:{ gt:currentDate }}}},
                    {slug: slug}
                    
                ]
            }
        })
        return component;
    }catch(error) {
        return null;
    }
}
export const getComponentsWithFeatures = async(idArray : number[] | undefined) => {
    const currentDate = new Date();
    if(!idArray) return [];
    try{
const componentsWithFeatures : FullComponentWithFeatures[] = await prisma.component.findMany({
        include:{
            Brand:true,
            Category:true,
            Pricing:{
                take:1,
                select:{
                    price:true,
                    originalPrice:true
                }
            },
            
            ComponentPicture:{
                take:1,
                select:{
                    Picture:{
                        select:{name:true}
                    }
                }
            },
            ComponentFeature:{
                select:{
                    Feature:{
                        select:{name:true}
                    },
                    value:true
                }
            }
        },
        where:{
            AND:[
                {Pricing:{every:{startDateTime:{lt:currentDate}, endDateTime:{ gt:currentDate }}}},
                {id:{in:idArray}},
                
            ]
        }
    })
    return JSON.parse(JSON.stringify(
        componentsWithFeatures,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
      ));
    }catch(err) {
        console.log(err);
        return null;
    }
    
}
export const getComponentStock = async(componentId : number) => {
    const currentDate = new Date();
    try{
        const component = await prisma.component.findFirst({
            select:{stock: true},
            where: {
                AND:[
                    {Pricing:{
                        every:{
                            startDateTime:{ lt:currentDate },
                            endDateTime:{ gt:currentDate }
                        }
                    }},
                    {id: componentId}
                ],
            }
        })
        return component ? component.stock : 0;
    }catch(error) {
        return 0;
    }
}