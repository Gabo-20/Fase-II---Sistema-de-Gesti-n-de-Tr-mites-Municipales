const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { verificarToken } = require('../middlewares/auth');

const prisma = new PrismaClient();

// GET /api/tipos-tramite  — lista los tipos activos para poblar selects
router.get('/', verificarToken, async (req, res) => {
  try {
    const tipos = await prisma.tipoTramite.findMany({
      where: { activo: true },
      select: { id: true, nombre: true, descripcion: true },
      orderBy: { id: 'asc' },
    });
    res.json(tipos);
  } catch {
    res.status(500).json({ error: 'Error al obtener tipos de trámite' });
  }
});

module.exports = router;
