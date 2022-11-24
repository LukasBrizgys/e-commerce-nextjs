import { NextApiRequest, NextApiResponse } from "next";

export default async function onError(
    error: Error,
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void,
) {
    console.log(error.message)
    res.status(500).end(error.toString());
    next();
}