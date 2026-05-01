const request = require('supertest');
const app = require('../src/app');

// Mock Prisma y bcrypt para no depender de BD en tests unitarios
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    usuario: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

beforeEach(() => jest.clearAllMocks());

// ── POST /api/auth/registro ──────────────────────────────────────────────────

describe('POST /api/auth/registro', () => {
  const body = { nombre: 'Juan', correo: 'juan@test.com', dpi: '1234567890101', password: 'pass123' };

  test('201 — crea usuario con datos válidos', async () => {
    prisma.usuario.findFirst.mockResolvedValue(null);
    prisma.usuario.create.mockResolvedValue({ id: 'uuid-1', ...body, rol: 'CIUDADANO', creadoEn: new Date() });

    const res = await request(app).post('/api/auth/registro').send(body);

    expect(res.status).toBe(201);
    expect(res.body.usuario).toHaveProperty('id');
    expect(res.body.usuario.rol).toBe('CIUDADANO');
  });

  test('409 — correo o DPI duplicado', async () => {
    prisma.usuario.findFirst.mockResolvedValue({ id: 'existing' });

    const res = await request(app).post('/api/auth/registro').send(body);

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/ya registrado/i);
  });

  test('400 — faltan campos requeridos', async () => {
    const res = await request(app).post('/api/auth/registro').send({ correo: 'x@x.com' });

    expect(res.status).toBe(400);
  });
});

// ── POST /api/auth/login ─────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  const usuarioMock = {
    id: 'uuid-1',
    nombre: 'Juan',
    correo: 'juan@test.com',
    passwordHash: 'hashed_password',
    rol: 'CIUDADANO',
    activo: true,
  };

  test('200 — devuelve token con credenciales correctas', async () => {
    prisma.usuario.findUnique.mockResolvedValue(usuarioMock);
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'juan@test.com', password: 'pass123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario.correo).toBe('juan@test.com');
  });

  test('401 — contraseña incorrecta', async () => {
    prisma.usuario.findUnique.mockResolvedValue(usuarioMock);
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'juan@test.com', password: 'wrong' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/credenciales inválidas/i);
  });

  test('401 — usuario no existe', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'noexiste@test.com', password: 'pass123' });

    expect(res.status).toBe(401);
  });

  test('400 — faltan campos', async () => {
    const res = await request(app).post('/api/auth/login').send({ correo: 'x@x.com' });

    expect(res.status).toBe(400);
  });
});

// ── GET /api/auth/me ─────────────────────────────────────────────────────────

describe('GET /api/auth/me', () => {
  test('401 — sin token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('401 — token inválido', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token_invalido');
    expect(res.status).toBe(401);
  });
});
