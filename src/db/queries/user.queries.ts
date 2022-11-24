import { prisma } from "../config/prismaConfig"
export const checkUserInDatabase = async(emailToCheck : string) => {
    const response = await prisma.users.findFirst({
        select:{
            email:true,
        },
        where: {email: emailToCheck}
    })
    return response?.email;
}