const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    tipoTramite: { findUnique: jest.fn() },
    solicitud: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    historialEstado: { create: jest.fn() },
    usuario: { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn() },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function tokenCiudadano(id = 'ciudadano-uuid') {
  return jwt.sign({ sub: id, rol: 'CIUDADANO' }, process.env.JWT_SECRET);
}

function tokenOperador(id = 'operador-uuid') {
  return jwt.sign({ sub: id, rol: 'OPERADOR' }, process.env.JWT_SECRET);
}

const solicitudMock = {
  id: 'sol-uuid-1',
  numeroExpediente: 'EXP-2026-123456',
  ciudadanoId: 'ciudadano-uuid',
  tipoTramiteId: 1,
  estado: 'RECIBIDA',
  fechaSolicitud: new Date().toISOString(),
  tipoTramite: { id: 1, nombre: 'Licencia Comercial' },
};

beforeEach(() => jest.clearAllMocks());

// ── POST /api/tramites ───────────────────────────────────────────────────────

describe('POST /api/tramites', () => {
  test('201 — crea solicitud con datos válidos', async () => {
    prisma.tipoTramite.findUnique.mockResolvedValue({ id: 1, nombre: 'Licencia Comercial', activo: true });
    prisma.solicitud.create.mockResolvedValue(solicitudMock);
    prisma.historialEstado.create.mockResolvedValue({});

    const res = await request(app)
      .post('/api/tramites')
      .set('Authorization', `Bearer ${tokenCiudadano()}`)
      .send({ tipoTramiteId: 1 });

    expect(res.status).toBe(201);
    expect(res.body.solicitud.numeroExpediente).toMatch(/^EXP-/);
    expect(res.body.solicitud.estado).toBe('RECIBIDA');
  });

  test('401 — sin token', async () => {
    const res = await request(app).post('/api/tramites').send({ tipoTramiteId: 1 });
    expect(res.status).toBe(401);
  });

  test('403 — rol OPERADOR no puede crear solicitud', async () => {
    const res = await request(app)
      .post('/api/tramites')
      .set('Authorization', `Bearer ${tokenOperador()}`)
      .send({ tipoTramiteId: 1 });
    expect(res.status).toBe(403);
  });

  test('400 — falta tipoTramiteId', async () => {
    const res = await request(app)
      .post('/api/tramites')
      .set('Authorization', `Bearer ${tokenCiudadano()}`)
      .send({});
    expect(res.status).toBe(400);
  });

  test('404 — tipo de trámite inválido', async () => {
    prisma.tipoTramite.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/tramites')
      .set('Authorization', `Bearer ${tokenCiudadano()}`)
      .send({ tipoTramiteId: 999 });

    expect(res.status).toBe(404);
  });
});

// ── GET /api/tramites ────────────────────────────────────────────────────────

describe('GET /api/tramites', () => {
  test('200 — lista solicitudes del ciudadano', async () => {
    prisma.solicitud.findMany.mockResolvedValue([solicitudMock]);

    const res = await request(app)
      .get('/api/tramites')
      .set('Authorization', `Bearer ${tokenCiudadano()}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
  });

  test('401 — sin token', async () => {
    const res = await request(app).get('/api/tramites');
    expect(res.status).toBe(401);
  });
});
