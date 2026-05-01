const tramiteService = require('../services/tramiteService');

async function crearSolicitud(req, res) {
  try {
    const solicitud = await tramiteService.crearSolicitud({
      ciudadanoId: req.usuario.id,
      tipoTramiteId: req.body.tipoTramiteId,
    });
    res.status(201).json({ message: 'Solicitud creada', solicitud });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function listarSolicitudes(req, res) {
  try {
    const solicitudes = await tramiteService.listarSolicitudesCiudadano(req.usuario.id);
    res.json(solicitudes);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function obtenerSolicitud(req, res) {
  try {
    const solicitud = await tramiteService.obtenerSolicitud(
      req.params.id,
      req.usuario.rol === 'CIUDADANO' ? req.usuario.id : null
    );
    res.json(solicitud);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { crearSolicitud, listarSolicitudes, obtenerSolicitud };
