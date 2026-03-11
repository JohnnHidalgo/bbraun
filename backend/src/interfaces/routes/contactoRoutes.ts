import { Router } from 'express';
import { ContactoController } from '../controllers/contactoController';

const router = Router();
const contactoController = new ContactoController();

// Rutas para contactos
router.get('/cliente/:clienteId', (req, res) => contactoController.getContactosByCliente(req, res));
router.get('/:id', (req, res) => contactoController.getContactoById(req, res));
router.post('/', (req, res) => contactoController.createContacto(req, res));
router.put('/:id', (req, res) => contactoController.updateContacto(req, res));
router.delete('/:id', (req, res) => contactoController.deleteContacto(req, res));
router.patch('/:id/principal', (req, res) => contactoController.setContactoPrincipal(req, res));

export default router;