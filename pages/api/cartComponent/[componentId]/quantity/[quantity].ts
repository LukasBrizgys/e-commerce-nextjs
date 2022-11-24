import nc from 'next-connect';
import onError from "../../../../../src/lib/errors";
import { patchCartComponentQuantity } from "../../../../../controllers/cartComponentController";
const handler = nc({onError});
handler.patch(patchCartComponentQuantity);
export default handler;