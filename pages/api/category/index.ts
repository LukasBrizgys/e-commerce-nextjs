import nc from 'next-connect';
import { createCategory, getAllCategories } from '../../../controllers/categoriesController';
import onError from '../../../src/lib/errors';
const handler = nc({onError});

handler.get(getAllCategories);

handler.post(createCategory);

export default handler;