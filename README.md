# ForenSeek_PC

ForenSeek_PC es el trabajo final del curso de Programación Competitiva.

## Descripción

ForenSeek_PC es una plataforma orientada a búsquedas forenses de información, con una arquitectura separada entre cliente y servidor para gestionar autenticación, registro de búsquedas e historial.
El proyecto está dividido en dos partes:

- **Frontend**: aplicación web construida con React + Vite.
- **Backend**: API construida con Node.js + Express y conexión a MongoDB.

## Características

- Registro e inicio de sesión de usuarios.
- Creación y consulta de búsquedas.
- Historial de búsquedas realizadas.
- Separación clara de responsabilidades entre interfaz y API.

## Flujo de datos

1. El usuario interactúa con la interfaz en el frontend.
2. El frontend envía solicitudes HTTP al backend.
3. El backend valida la solicitud, aplica lógica de negocio y consulta/persiste datos en MongoDB.
4. El backend responde al frontend con los resultados.
5. El frontend muestra la información procesada al usuario.

## Estructura del proyecto

```text
ForenSeek_PC/
├── frontend/
└── backend/
```

## Requisitos previos

- Node.js (recomendado v18 o superior)
- npm
- MongoDB en ejecución (local o remoto)

## Instalación

Desde la raíz del repositorio:

```bash
npm install --prefix backend
npm install --prefix frontend
```

## Ejecución en desarrollo

### Backend

```bash
npm run dev --prefix backend
```

### Frontend

```bash
npm run dev --prefix frontend
```

## Autores

- cosmiccat05
- SolidDogor
- dantexuchofen
