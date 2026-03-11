import { Router } from 'express';
import {
  getTickets,
  createTicket,
  getTicketById,
  updateTicket,
  deleteTicket,
} from '../controllers/ticketController';

const router = Router();

router.get('/', getTickets);
router.post('/', createTicket);
router.get('/:id', getTicketById);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

export default router;