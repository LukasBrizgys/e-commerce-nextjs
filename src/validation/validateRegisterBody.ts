import { check, validationResult} from "express-validator";
import initMiddleware from "../lib/initMiddleware";
import validateMiddleware from "../lib/validateMiddleware";

const validateRegisterBody = initMiddleware(
    validateMiddleware([
        check('name')
    .trim().escape()
    .isLength({min: 3})
    .withMessage('Vardą turi sudaryti bent 3 simboliai')
    .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)
    .withMessage('Vardą turi sudaryti tik simboliai'),
    
    check('surname')
    .trim().escape()
    .isLength({min: 3})
    .withMessage('Pavardę turi sudaryti bent 3 simboliai')
    .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)
    .withMessage('Pavardę turi sudaryti tik simboliai'),
    
    check('email').normalizeEmail()
    .isEmail()
    .withMessage('Netinkamas el. pašto formatas'),
    check('birthDate')
    .notEmpty()
    .withMessage('Įveskite datą')
    .isDate()
    .withMessage('Neteisinga data'),
    check('password')
    .isLength({min: 8})
    .withMessage('Slaptažodį turi sudaryti 8 arba daugiau simbolių')
    .matches(/(?=.*?[a-ząčęėįšųū])/)
    .withMessage('Slaptažodyje turi būti bent viena mažoji raidė')
    .matches(/(?=.*?[A-ZĄČĘĖĮŠŲŪ])/)
    .withMessage('Slaptažodyje turi būti bent viena didžioji raidė')
    .matches(/(?=.*?[0-9])/)
    .withMessage('Slaptažodyje turi būti bent vienas skaičius')
    .matches(/(?=.*?[.#?!@$%^&*-])/)
    .withMessage('Slaptažodyje turi būti bent vienas simbolis'),
    
    check('passwordRepeat')
    .notEmpty()
    .withMessage('Pakartokite slaptažodį')
    .custom((value, {req}) =>{
        if(value !== req.body.password){
            throw new Error('Nesutampa slaptažodžiai')
        }
        return true;
    }),

    check('consent')
    .exists({checkFalsy:true})
    .withMessage('Sutikite su taisyklėmis')

    ], validationResult)

)
export default validateRegisterBody;