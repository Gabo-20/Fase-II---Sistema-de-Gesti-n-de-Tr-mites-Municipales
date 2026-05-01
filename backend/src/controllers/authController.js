const authService = require('../services/authService');

async function registro(req, res) {
  try {
    const usuario = await authService.registrar(req.body);
    res.status(201).json({ message: 'Usuario registrado', usuario });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const resultado = await authService.login(req.body);
    res.json(resultado);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function me(req, res) {
  try {
    const usuario = await authService.obtenerPerfil(req.usuario.id);
    res.json(usuario);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { registro, login, me };
