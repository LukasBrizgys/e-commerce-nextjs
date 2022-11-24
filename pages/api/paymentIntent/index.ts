import onError from "../../../src/lib/errors";
import nc from 'next-connect';
import createPaymentIntent from "../../../controllers/paymentIntentController";
const handler = nc({onError});
handler.post(createPaymentIntent);
export default handler;