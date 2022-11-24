import onError from "../../../src/lib/errors";
import nc from 'next-connect';
import register from "../../../controllers/registerController";
const handler = nc({onError});
handler.post(register);
export default handler;
