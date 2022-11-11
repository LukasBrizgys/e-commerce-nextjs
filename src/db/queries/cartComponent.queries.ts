import { CartComponent, Prisma } from "@prisma/client";
import { CartComponentBase } from "../../types/CartComponent.type";
import { prisma } from "../config/prismaConfig"
export const getAmountInCart = async(componentId : number, cartId : bigint | number) : Promise<number | undefined> => {
    let quantityInCart : number | undefined;
    try{
        const cartComponent = await prisma.cartComponent.findFirst({
            select:{quantity: true},
            where:{
                componentId: componentId,
                cartId: cartId
            }
        })
        quantityInCart = cartComponent?.quantity;
        return quantityInCart;
    }catch(error) {
        console.log(error);
    }
    return quantityInCart;
}
export const getCartComponent = async(componentId : number, cartId : bigint | number) : Promise<CartComponent | null> => {
    try{
        const cartComponent = await prisma.cartComponent.findFirstOrThrow({
            where:{ componentId: componentId, cartId: cartId},
        })
        return cartComponent;
    }catch(error) {
        return null;
    }
}
export const getAllCartComponents = async(cartId : bigint | number) => {
    const currentDate : Date = new Date();
    try{
        const cartComponents = await prisma.cartComponent.findMany({
            select: {
                Component:{
                    select:{
                        name:true,
                        slug:true,
                        Category:true,
                        Brand:true,
                        ComponentPicture:{
                            include:{Picture:true},
                            take:1
                        },
                        Pricing:{
                            where:{
                                AND:[
                                    {startDateTime:{ lt:currentDate }},
                                    {endDateTime:{ gt:currentDate }}
                                ]
                            }
                        }
                    },
                    
                },
                componentId:true,
                quantity:true,
                createdAt:true
            },
            where:{
                cartId:cartId
            }
        })
        return cartComponents;
    }catch(err) {
        console.log(err);
    }
}
export const insertOrUpdateCartItem = async(cartId : bigint, componentId : number, amount : number, oldAmount? : number) => {
    try{
        const currentDate : Date = new Date();
        const component = await prisma.cartComponent.upsert({
            select:{
                Component:{
                     select:{
                        name:true,
                        slug:true,
                        Category:true,
                        Brand:true,
                        ComponentPicture:{
                            include:{Picture:true},
                            take:1
                        },
                        Pricing:{
                            where:{
                                AND:[
                                        {startDateTime:{ lt:currentDate }},
                                        {endDateTime:{ gt:currentDate }}
                                ]
                            },
                            take:1
                        }
                     }     
                },
                componentId: true,
                quantity:true,
                createdAt:true,

            },
            where:{
                cartId_componentId:{
                    cartId:cartId,
                    componentId:componentId
                    }
                },
                update:{
                    quantity: oldAmount && oldAmount + amount,
                    updatedAt:currentDate
                },
                create:{
                    cartId:cartId,
                    componentId:componentId,
                    quantity: amount,
                    createdAt: currentDate
                },
                
            })
            return component;
    }catch(error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return error;
        }
    }
    
}
export const updateCartComponentQuantity = async(componentId : number, cartId : bigint | number, quantity : number) => {
    try{
        const updatedComponent : CartComponentBase = await prisma.cartComponent.update({
            select:{
                componentId: true,
                quantity:true,
                createdAt:true,
                updatedAt:true,
            },
            where:{
                cartId_componentId:{
                    cartId: cartId,
                    componentId: componentId
                },
            },
            data:{
                    quantity: quantity
                }
        })
        return updatedComponent;
    }catch(err) {
        console.log(err);
    }
    return null;
}
export const deleteCartComponent = async(componentId : number, cartId : bigint | number) => {
    try{
        const deletedComponent : CartComponentBase = await prisma.cartComponent.delete({
            select:{
                componentId: true,
                quantity:true,
                createdAt:true,
                updatedAt:true,
            },
            where: {
                cartId_componentId:{
                    cartId: cartId,
                    componentId: componentId
                }
            }
        })
        return deletedComponent;
    }catch(error) {
        console.log(error);
    }
    return null;
}