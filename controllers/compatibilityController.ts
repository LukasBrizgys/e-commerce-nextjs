import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../src/db/config/prismaConfig";
import catchAsyncErrors from "../src/lib/catchAsyncErrors";
import fs from 'fs';
import { getCompatibleIds, getComponentsWithFeatures } from "../src/db/queries/component.queries";
import getNumber from "../src/utils/getNumber";
import { IAttributes } from "../pages/suderinamumas";
interface FeatureValuePair {
    feature : string,
    value : string | number
}
interface CompatibilityComponent {
    featureValuePairs : FeatureValuePair[],
    componentId : number,
    categoryId : number
    name : string,
    price : number
}
const checkCompatibility = catchAsyncErrors(async(req : NextApiRequest, res : NextApiResponse) => {
    const category = getNumber(req.query.category?.toString(), undefined);
    console.log(req.query);
    /*
    const attributes : IAttributes = {
        cpuSocket: req.query.cpuSocket?.toString(),
        moboForm: req.query.moboForm?.toString(),
        sata: req.query.sata?.toString(),
        m2: req.query.m2?.toString(),
        ramSlot: req.query.ramSlot?.toString()

    }
    */
   const attributes = {
        cpuSocket: category === 1 || category === 2 ? req.query.cpuSocket?.toString() : undefined,
        moboForm: category === 2 || category === 7 ? req.query.moboForm?.toString() : undefined,
        caseForm: category === 1 || category === 7 || category === 6 ? req.query.caseForm?.toString() : undefined,
        sata: category === 4 ? req.query.sata?.toString() : undefined,
        m2: category === 4 ? req.query.m2?.toString() : undefined,
        ramSlot: category === 2 || category === 3 ? req.query.ramSlot?.toString() : undefined
   }
   console.log(attributes);
   const result = await getCompatibleIds(category, attributes);
   const components = await getComponentsWithFeatures(result);
    //console.log(components);
    /* 
    const components : CompatibilityComponent = await prisma.$queryRaw`SELECT json_agg(json_build_object(
      
        "Feature".name,
        "ComponentFeature".value)
      ) AS "featureValuePairs", "ComponentFeature"."componentId", "Component".name, "Component"."categoryId", "Pricing".price
    FROM "ComponentFeature"
    INNER JOIN "Component" ON "Component".id = "ComponentFeature"."componentId"
    INNER JOIN "Feature" ON "Feature".id = "ComponentFeature"."featureId"
    INNER JOIN "Pricing" ON "Pricing".id = "ComponentFeature"."componentId"
    WHERE NOW() BETWEEN "Pricing"."startDateTime" AND "Pricing"."endDateTime"
    GROUP BY "ComponentFeature"."componentId", "Pricing".price, "Component".name, "Component"."categoryId" LIMIT 200;`;
    console.log(components);
    const componentsString = JSON.stringify(components, (key, value) => (typeof value === 'bigint' ? value.toString() : value));
    fs.writeFile('./sample.json',componentsString, (error) => {
        console.log(error)
        console.log('saved');
    });
    */
    res.status(200).send({components: components});
})
export { checkCompatibility };