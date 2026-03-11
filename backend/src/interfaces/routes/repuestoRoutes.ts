import { Router } from 'express';
import {
  getRepuestos,
  createRepuesto,
  getRepuestoById,
  updateRepuesto,
  deleteRepuesto,
  getRepuestosByCliente,
} from '../controllers/repuestoController';

const router = Router();

router.get('/', getRepuestos);
router.post('/', createRepuesto);
router.get('/cliente/:clienteId', getRepuestosByCliente);
router.get('/:id', getRepuestoById);
router.put('/:id', updateRepuesto);
router.delete('/:id', deleteRepuesto);

export default router;