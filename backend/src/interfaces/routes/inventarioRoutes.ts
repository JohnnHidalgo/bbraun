import { Router } from 'express';
import {
  getInventarios,
  getInventariosByCliente,
  getInventarioById,
  createInventario,
  updateInventario,
  deleteInventario,
} from '../controllers/inventarioController';

const router = Router();

router.get('/', getInventarios);
router.get('/cliente/:clienteId', getInventariosByCliente);
router.get('/:id', getInventarioById);
router.post('/', createInventario);
router.put('/:id', updateInventario);
router.delete('/:id', deleteInventario);

export default router;
