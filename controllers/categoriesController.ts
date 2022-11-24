import { NextApiRequest, NextApiResponse } from "next";
import catchAsyncErrors from "../src/lib/catchAsyncErrors";
import { prisma } from "../src/db/config/prismaConfig";
import getNumber from "../src/utils/getNumber";
const getAllCategories = catchAsyncErrors(async (req : NextApiRequest, res : NextApiResponse) => {
    const categories = await prisma.category.findMany();
    res.status(200).send({
        status:'200',
        categories
    });
});
const createCategory = catchAsyncErrors(async (req : NextApiRequest, res : NextApiResponse) => {
    const { name , slug } : {name : string, slug : string} = req.body;
    const createdCategory = await prisma.category.create({
        data:{
            name: name,
            slug: slug
        }
    })
    res.status(200).send({status:'200', createdCategory})
})
const deleteCategory = catchAsyncErrors(async (req : NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    await prisma.category.delete({
        where:{
            id: getNumber(id?.toString(), null)
        },
    })
    res.status(200).json({
        status:'200'
    })
})
export { getAllCategories, createCategory, deleteCategory };