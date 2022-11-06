import { FullComponent } from "../../types/Component.types";
import { prisma } from "../config/prismaConfig";
export const getCategoryComponentsBySlug = async(slug : string) => {
    const currentDate = new Date();
    try{
        const components : FullComponent[] = await prisma.component.findMany({
            where:{
                Category:{
                    slug:{
                        equals:slug
                    },
                },
                AND:[
                    {Pricing:{
                        every:{
                            startDateTime:{ lt:currentDate },
                            endDateTime:{ gt:currentDate }
                        }
                    }},

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
        return components;
    }catch(err) {
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