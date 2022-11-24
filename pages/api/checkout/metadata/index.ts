import nc from 'next-connect';
import onError from "../../../../src/lib/errors";
import updateCheckoutEmail from "../../../../controllers/checkoutController";
const handler = nc({onError});
handler.post(updateCheckoutEmail);
export default handler;