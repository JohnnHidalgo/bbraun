import { Router } from 'express';
import { getAgencias, getAgenciaById, createAgencia, updateAgencia, deleteAgencia } from '../controllers/agenciaController';

const router = Router();

router.get('/', getAgencias);
router.get('/:id', getAgenciaById);
router.post('/', createAgencia);
router.put('/:id', updateAgencia);
router.delete('/:id', deleteAgencia);

export default router;
