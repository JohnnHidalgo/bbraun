import { Router } from 'express';
import {
  getMaquinas,
  createMaquina,
  getMaquinaById,
  updateMaquina,
  deleteMaquina,
} from '../controllers/maquinaController';

const router = Router();

router.get('/', getMaquinas);
router.post('/', createMaquina);
router.get('/:id', getMaquinaById);
router.put('/:id', updateMaquina);
router.delete('/:id', deleteMaquina);

export default router;