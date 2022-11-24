import nc from "next-connect";
import onError from "../../../src/lib/errors";
import { addCartComponent, getAllCartComponentsByCartId } from "../../../controllers/cartComponentController";
const handler = nc({onError});
handler.post(addCartComponent);
handler.get(getAllCartComponentsByCartId);
export default handler;