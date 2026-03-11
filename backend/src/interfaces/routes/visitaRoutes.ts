import { Router } from 'express';
import {
  getVisitas,
  createVisita,
  getVisitaById,
  updateVisita,
  deleteVisita,
} from '../controllers/visitaController';

const router = Router();

router.get('/', getVisitas);
router.post('/', createVisita);
router.get('/:id', getVisitaById);
router.put('/:id', updateVisita);
router.delete('/:id', deleteVisita);

export default router;