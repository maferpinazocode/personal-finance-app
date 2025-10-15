# Personal finance app

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mafers-projects-29cd459b/v0-personal-finance-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/UqltBfUhOxG)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/mafers-projects-29cd459b/v0-personal-finance-app](https://vercel.com/mafers-projects-29cd459b/v0-personal-finance-app)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/UqltBfUhOxG](https://v0.app/chat/projects/UqltBfUhOxG)**

## Configuración de Gemini AI

Esta aplicación usa Google Gemini AI para proporcionar respuestas inteligentes en el chat de finanzas.

### Paso 1: Obtener API Key

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API key
4. Copia la API key generada

### Paso 2: Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   copy .env.example .env.local
   ```

2. Abre `.env.local` y reemplaza `tu_api_key_aqui` con tu API key de Gemini:
   ```
   GEMINI_API_KEY=tu_api_key_real_aqui
   ```

### Paso 3: Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Características

- 💬 Chat inteligente con Gemini AI
- 💰 Registro automático de gastos
- 📊 Reportes de gastos
- 🎨 Interfaz moderna con Next.js y Tailwind CSS

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
