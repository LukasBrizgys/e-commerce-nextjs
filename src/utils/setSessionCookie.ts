import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from 'crypto';
/**
 * Sets the session cookie and returns sessions UUID
 * @param req Next request object
 * @param res Next response object
 * @returns session UUID
 */
const setSessionCookie = async(req : NextApiRequest, res : NextApiResponse) : Promise<string> => {
    const sessionId = crypto.randomUUID();
    let expiryDate = new Date();
    const month = (expiryDate.getMonth() + 1) % 12;
    expiryDate.setMonth(month);
    setCookie('sessionId', sessionId, {req, res, httpOnly:true, path:'/', expires: expiryDate, sameSite:'lax'});
    return sessionId;
}
export default setSessionCookie;