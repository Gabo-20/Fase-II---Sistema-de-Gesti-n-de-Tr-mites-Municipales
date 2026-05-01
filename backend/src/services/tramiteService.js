const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function generarExpediente() {
  const anio = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `EXP-${anio}-${random}`;
}

async function crearSolicitud({ ciudadanoId, tipoTramiteId }) {
  if (!tipoTramiteId) {
    throw Object.assign(new Error('tipoTramiteId es requerido'), { status: 400 });
  }

  const tipo = await prisma.tipoTramite.findUnique({ where: { id: Number(tipoTramiteId) } });
  if (!tipo || !tipo.activo) {
    throw Object.assign(new Error('Tipo de trámite no válido'), { status: 404 });
  }

  const solicitud = await prisma.solicitud.create({
    data: {
      numeroExpediente: generarExpediente(),
      ciudadanoId,
      tipoTramiteId: Number(tipoTramiteId),
      estado: 'RECIBIDA',
    },
    include: {
      tipoTramite: { select: { id: true, nombre: true } },
    },
  });

  await prisma.historialEstado.create({
    data: {
      solicitudId: solicitud.id,
      estado: 'RECIBIDA',
      comentario: 'Solicitud recibida',
    },
  });

  return solicitud;
}

async function listarSolicitudesCiudadano(ciudadanoId) {
  return prisma.solicitud.findMany({
    where: { ciudadanoId },
    include: { tipoTramite: { select: { id: true, nombre: true } } },
    orderBy: { fechaSolicitud: 'desc' },
  });
}

async function obtenerSolicitud(id, ciudadanoId) {
  const solicitud = await prisma.solicitud.findUnique({
    where: { id },
    include: {
      tipoTramite: { select: { id: true, nombre: true } },
      historial: { orderBy: { creadoEn: 'asc' } },
    },
  });

  if (!solicitud) {
    throw Object.assign(new Error('Solicitud no encontrada'), { status: 404 });
  }

  // Ciudadano solo puede ver sus propias solicitudes
  if (ciudadanoId && solicitud.ciudadanoId !== ciudadanoId) {
    throw Object.assign(new Error('Sin permisos para ver esta solicitud'), { status: 403 });
  }

  return solicitud;
}

module.exports = { crearSolicitud, listarSolicitudesCiudadano, obtenerSolicitud };
