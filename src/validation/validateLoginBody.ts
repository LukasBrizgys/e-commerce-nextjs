import { check, validationResult} from "express-validator";
import initMiddleware from "../lib/initMiddleware";
import validateMiddleware from "../lib/validateMiddleware";

const validateLoginBody = initMiddleware(
    validateMiddleware([
    check('email')
    .notEmpty()
    .withMessage('Įveskite El. Paštą'),
    check('password')
    .notEmpty()
    .withMessage('Įveskite slaptažodį'),
    ], validationResult)
)
export default validateLoginBody;