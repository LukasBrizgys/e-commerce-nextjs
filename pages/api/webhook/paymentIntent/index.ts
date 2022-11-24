import nc from 'next-connect';
import onError from "../../../../src/lib/errors";
import captureCharge from "../../../../controllers/webhookController";
export const config = {
    api: {
        bodyParser: false,
    },
};
const handler = nc({onError});
handler.post(captureCharge);
export default handler;
