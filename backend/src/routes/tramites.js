const { Router } = require('express');
const {
  crearSolicitud,
  listarSolicitudes,
  obtenerSolicitud,
  resolverSolicitud,
  agregarObservacion,
  renovarLicencia,
} = require('../controllers/tramiteController');
const { verificarToken, soloRoles } = require('../middlewares/auth');

const router = Router();

router.use(verificarToken);

// Cualquier usuario autenticado puede crear y renovar
router.post('/',            crearSolicitud);
router.post('/:id/renovar', renovarLicencia);

// Todos los autenticados
router.get('/',                                                         listarSolicitudes);
router.get('/:id',                                                      obtenerSolicitud);

// Operador+
router.patch('/:id/resolucion', soloRoles('OPERADOR','SUPERVISOR','ADMIN'), resolverSolicitud);
router.post('/:id/observaciones', soloRoles('OPERADOR','SUPERVISOR','ADMIN'), agregarObservacion);

module.exports = router;
