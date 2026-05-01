const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function registrar({ nombre, correo, dpi, password }) {
  if (!nombre || !correo || !dpi || !password) {
    throw Object.assign(new Error('Todos los campos son requeridos'), { status: 400 });
  }

  const existe = await prisma.usuario.findFirst({
    where: { OR: [{ correo }, { dpi }] },
  });
  if (existe) {
    throw Object.assign(new Error('Correo o DPI ya registrado'), { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const usuario = await prisma.usuario.create({
    data: { nombre, correo, dpi, passwordHash, rol: 'CIUDADANO' },
    select: { id: true, nombre: true, correo: true, dpi: true, rol: true, creadoEn: true },
  });

  return usuario;
}

async function login({ correo, password }) {
  if (!correo || !password) {
    throw Object.assign(new Error('Correo y contraseña requeridos'), { status: 400 });
  }

  const usuario = await prisma.usuario.findUnique({ where: { correo } });
  if (!usuario || !usuario.activo) {
    throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });
  }

  const valido = await bcrypt.compare(password, usuario.passwordHash);
  if (!valido) {
    throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });
  }

  const token = jwt.sign(
    { sub: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    },
  };
}

async function obtenerPerfil(userId) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: userId },
    select: { id: true, nombre: true, correo: true, dpi: true, rol: true, creadoEn: true },
  });
  if (!usuario) {
    throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });
  }
  return usuario;
}

module.exports = { registrar, login, obtenerPerfil };
