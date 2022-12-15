import nc from 'next-connect';
import { checkCompatibility } from '../../../controllers/compatibilityController';
import onError from '../../../src/lib/errors';
const handler = nc({onError});
handler.get(checkCompatibility);
export default handler;