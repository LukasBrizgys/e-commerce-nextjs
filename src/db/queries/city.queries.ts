import { prisma } from "../config/prismaConfig";
export const getAllCities = () => {
    try{
        const cities = prisma.city.findMany();
        return cities;
    }catch(_error) {
        return null;
    }
    return null;
}