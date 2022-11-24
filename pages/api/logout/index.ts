import nc from 'next-connect';
import logout from "../../../controllers/logoutController";
import onError from "../../../src/lib/errors";
const handler = nc({onError});
handler.post(logout);
export default handler;