const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { verificarToken } = require('../middlewares/auth');

const prisma = new PrismaClient();

// GET /api/notificaciones — historial de cambios de estado de las solicitudes del usuario
router.get('/', verificarToken, async (req, res) => {
  try {
    const historial = await prisma.historialEstado.findMany({
      where: {
        solicitud: { ciudadanoId: req.usuario.id },
      },
      include: {
        solicitud: {
          select: {
            numeroExpediente: true,
            tipoTramite: { select: { nombre: true } },
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
