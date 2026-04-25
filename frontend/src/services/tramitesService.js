import api from './api'

export const tramitesService = {
  // Solicitudes generales
  getMisSolicitudes: () => api.get('/tramites/mis-solicitudes'),
  getSolicitudById: (id) => api.get(`/tramites/${id}`),

  // Licencias (US04, US05, US06)
  crearLicencia: (data) => api.post('/tramites/licencias', data),
  renovarLicencia: (id, data) => api.put(`/tramites/licencias/${id}/renovar`, data),
  aprobarRechazarLicencia: (id, data) => api.patch(`/tramites/licencias/${id}/resolucion`, data),

  // Permisos de construcción (US07, US08, US09)
  crearPermisoConstruccion: (data) => api.post('/tramites/construccion', data),
  getEstadoPermiso: (id) => api.get(`/tramites/construccion/${id}`),
  agregarObservacion: (id, data) => api.post(`/tramites/construccion/${id}/observaciones`, data),

  // Catastro (US10, US11, US12)
  actualizarPropietario: (id, data) => api.put(`/tramites/catastro/${id}/propietario`, data),
  solicitarDeslinde: (data) => api.post('/tramites/catastro/deslinde', data),
  actualizarValuacion: (id, data) => api.put(`/tramites/catastro/${id}/valuacion`, data),

  // Funcionario — cola de trabajo
  getSolicitudesPendientes: () => api.get('/tramites/pendientes'),
}
