import { NextApiRequest, NextApiResponse } from "next";
import catchAsyncErrors from "../src/lib/catchAsyncErrors";
import { getCompatibleIds, getComponentsWithFeatures } from "../src/db/queries/component.queries";
import getNumber from "../src/utils/getNumber";
import { FullComponentWithFeatures } from "../src/types/Component.types";
const checkCompatibility = catchAsyncErrors(async(req : NextApiRequest, res : NextApiResponse) => {
    const category = getNumber(req.query.category?.toString(), undefined);
    //console.log(req.query);
   const attributes = {
        cpuSocket: category === 1 || category === 2 ? req.query.cpuSocket?.toString() : undefined,
        moboForm: category === 2 || category === 7 ? req.query.moboForm?.toString() : undefined,
        caseForm: category === 1 || category === 7 || category === 6 ? req.query.caseForm?.toString() : undefined,
        sata: category === 4 ? req.query.sata?.toString() : undefined,
        m2: category === 4 ? req.query.m2?.toString() : undefined,
        ramSlot: category === 2 || category === 3 ? req.query.ramSlot?.toString() : undefined,
        x1: category === 5 && getNumber(req.query.x1?.toString(), undefined),
        x4: category === 5 && getNumber(req.query.x4?.toString(), undefined),
        x8: category === 5 && getNumber(req.query.x8?.toString(), undefined),
        x16: category === 5 && getNumber(req.query.x16?.toString(), undefined),
        ramSlotCount : undefined
   }
   //console.log(attributes);
   const result = await getCompatibleIds(category, attributes);
   let components : FullComponentWithFeatures[] = await getComponentsWithFeatures(result);
   switch(category) {
        case 2:
        case 3:
            components = components.filter((component) => {
                const memorySlot = component.ComponentFeature.find((entry) => entry.Feature.name === 'Memory Slots')
                if(memorySlot?.value && req.query.ramSlotCount) {
                    return parseInt(memorySlot?.value) <= getNumber(req.query.ramSlotCount?.toString(), undefined);
                }
                return true;
            })
            break;
   }
   //console.log(req.query);
   res.status(200).send({components: components});
})
export { checkCompatibility };