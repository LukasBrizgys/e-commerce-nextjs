import nc from 'next-connect';
import onError from "../../../src/lib/errors";
import login from "../../../controllers/loginController";

const handler = nc({onError});
handler.post(login);
export default handler;
