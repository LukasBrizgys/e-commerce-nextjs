import nc from 'next-connect';
import { getComponents } from "../../../controllers/componentsController";
import onError from "../../../src/lib/errors";
const handler = nc({onError})
handler.get(getComponents);
export default handler;