const { Router } = require('express');
const { crearSolicitud, listarSolicitudes, obtenerSolicitud } = require('../controllers/tramiteController');
const { verificarToken, soloRoles } = require('../middlewares/auth');

const router = Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

router.post('/',    soloRoles('CIUDADANO'), crearSolicitud);
router.get('/',     soloRoles('CIUDADANO'), listarSolicitudes);
router.get('/:id',  obtenerSolicitud);

module.exports = router;
