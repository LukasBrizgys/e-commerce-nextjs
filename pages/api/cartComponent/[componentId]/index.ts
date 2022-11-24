import nc from 'next-connect';
import onError from "../../../../src/lib/errors";
import { deleteComponentFromCart } from "../../../../controllers/cartComponentController";

const handler = nc({onError});
handler.delete(deleteComponentFromCart);
export default handler;