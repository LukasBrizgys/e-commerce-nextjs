import nc from 'next-connect';
import onError from "../../../../src/lib/errors";
import captureCharge from "../../../../controllers/webhookController";
const handler = nc({onError});
handler.post(captureCharge);
export default handler;
