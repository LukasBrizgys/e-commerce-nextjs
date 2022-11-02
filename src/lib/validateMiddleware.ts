import { NextApiRequest, NextApiResponse } from "next";

export default function validateMiddleware(validations : any, validationResult : any) {
    return async (req : NextApiRequest, res : NextApiResponse, next : any) => {
      await Promise.all(validations.map((validation : any) => validation.run(req)))
      const errorFormatter = ({ msg } : any) =>{ return msg; }
      const errors = validationResult(req).formatWith(errorFormatter).mapped({ onlyFirstError: true });
      if (Object.keys(errors).length === 0) {
        return next()
      }
  
      res.status(422).json( errors );
    }
  }