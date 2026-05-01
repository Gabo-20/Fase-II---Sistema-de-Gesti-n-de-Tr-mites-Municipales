# Sistema de Gestión de Trámites Municipales

Sistema web para digitalizar trámites municipales (licencias comerciales, permisos de construcción y catastro) en municipios de Guatemala.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | Node.js + Express + Prisma |
| Base de datos | MariaDB |
| Autenticación | JWT + bcrypt |
| Correos | Nodemailer + Gmail SMTP |
| CI/CD | GitHub Actions |
| Hosting | VPS (Docker) |

## Estructura del repositorio

```
tramites-municipales/
├── frontend/         # React + Vite + Tailwind
├── backend/          # Node.js + Express + Prisma
├── docker-compose.yml         # Producción
├── docker-compose.dev.yml     # Desarrollo local
└── vps-setup.sh               # Setup inicial del VPS
```

## Correr en local

### Requisitos
- Docker y Docker Compose instalados

### Pasos

```bash
# 1. Copiar variables de entorno
cp .env.example .env
cp backend/.env.example backend/.env
# Editar ambos archivos con tus valores

# 2. Levantar servicios
docker compose -f docker-compose.dev.yml up --build

# 3. Correr migraciones (primera vez)
docker compose -f docker-compose.dev.yml exec backend npx prisma migrate dev
```

Servicios disponibles:
- **API:** http://localhost:3000
- **phpMyAdmin:** http://localhost:8080

## Equipo

| Nombre | Rol |
|--------|-----|
| Gabriel Perez | Backend |
| Bryan Martinez | Frontend |

## Curso

Ingeniería de Software — Universidad Mariano Gálvez de Guatemala
