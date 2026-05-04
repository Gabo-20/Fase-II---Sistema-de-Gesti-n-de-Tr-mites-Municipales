const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { verificarToken } = require('../middlewares/auth');

const prisma = new PrismaClient();

// GET /api/notificaciones
// CIUDADANO → cambios en sus solicitudes
// OPERADOR+ → últimos 50 cambios en todas las solicitudes
router.get('/', verificarToken, async (req, res) => {
  try {
    const esCiudadano = req.usuario.rol === 'CIUDADANO';

    const historial = await prisma.historialEstado.findMany({
      where: esCiudadano
        ? { solicitud: { ciudadanoId: req.usuario.id } }
        : {},
      include: {
        solicitud: {
          select: {
            id: true,
            numeroExpediente: true,
            tipoTramite: { select: { nombre: true } },
            ciudadano: esCiudadano ? false : { select: { nombre: true, correo: true } },
          },
        },
      },
      orderBy: { creadoEn: 'desc' },
      take: 50,
    });

    res.json(historial);
  } catch {
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});

module.exports = router;
