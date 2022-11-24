import { NextApiRequest, NextApiResponse } from "next";
import { findComponents } from "../src/db/queries/component.queries";
import catchAsyncErrors from "../src/lib/catchAsyncErrors";
import getNumber from "../src/utils/getNumber";
const getComponents = catchAsyncErrors(async(req : NextApiRequest, res : NextApiResponse) => {
    const { categorySlug, minPrice, maxPrice, brand } = req.query;
    const components = await findComponents({categorySlug:categorySlug?.toString(),
        minPrice:getNumber(minPrice?.toString(), undefined),
        maxPrice: getNumber(maxPrice?.toString(), undefined),
        brand:brand?.toString().split(',')
    });
    res.status(200).send({status:'200', components : components});
    return;
})
export { getComponents };