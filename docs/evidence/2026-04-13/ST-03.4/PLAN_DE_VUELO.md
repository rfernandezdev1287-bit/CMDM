### 🚀 PLAN DE VUELO: ST-03.4 (Sellado del Portal y Apertura de Fronteras)

**1. 🧠 INGESTIÓN DE MEMORIA (Lecciones de Guerra):**
*Sintetizado de Autopsias anteriores:*
- "Dato Técnico Descubierto: Las aplicaciones nativas en Node.js/Express, por defecto, decapitan las peticiones asíncronas de servidores tunelizados (Ej: Ngrok) si no existe un mapeo estricto del Origin en el Middleware CORS."
- "Regla de Evitación: Jamás permitir dominios hardcodeados como capa de seguridad ('fallback') dentro del código fuente de Infraestructura (`SocketServer.ts`). Toda variable de red perimetral debe inyectarse a través del archivo físico `.env`."

**2. 📑 TRAZABILIDAD DE DOCUMENTACIÓN (Source of Truth):**
- **Capa Cliente (Frontend):** `frontend/.env`, `frontend/vite.config.ts`
- **Capa Infraestructura (Backend):** `backend/.env`, `backend/src/infrastructure/socket-server/SocketServer.ts`
- **Docs de Arquitectura:** `docs/skills/rfdevlaw.md`

**3. 🏛️ FASE SOCRÁTICA (Análisis de Riesgos):**
- **Duda Metódica:** Al forzar estáticamente Ngrok en `vite.config.ts` y en los archivos CORS, podríamos bloquear al operador si la URL de Ngrok cambia (Ngrok free renueva IPs).
- **Fórmula de Resolución Síncrona:** Se implementará en Array de Strings dentro de Vite, permitiendo simultáneamente `localhost` y el túnel actual. Y en el Backend, si `.env` estalla o la URL muta, el sistema no recurrirá a un fallback peligroso, sino que rechazará nativamente las conexiones mostrando por consola un "WARNING de Permisos", cumpliendo la Ley de Trazabilidad.

**4. 🧪 FÓRMULA TÉCNICA (Inducción Activa):**
"En lugar de delegar el acceso a Ngrok mediante flags volátiles automáticos como `allowedHosts: true`, el algoritmo empleará [Array Explícito Dinámico] en Vite y [Inyección End-To-End sin Hardcodes] en Node.js, para enclavar las rutas en variables seguras de entorno físico."

**5. 🚦 TABLA DE TRAZABILIDAD:**
| ID | Dominio | Tarea Atómica | Estado |
|:---|:---|:---|:---:|
| T-01 | Config (Front) | Purgar `VITE_BACKEND_URL` en `frontend/.env` | 🔴 PENDIENTE |
| T-02 | Config (Back) | Sellar `ALLOWED_ORIGINS` en `backend/.env` | 🔴 PENDIENTE |
| T-03 | Build (Vite) | Imponer array a `server.allowedHosts` en `vite.config.ts` | 🔴 PENDIENTE |
| T-04 | Infraestructura | Erradicar hardcodes en capa CORS de `SocketServer.ts` | 🔴 PENDIENTE |

**Requerimiento:** Misión de Enlace Remoto y Apertura Segura de Túnel MecaTrack.
- **Módulos Afectados:** Capas `.env`, `vite.config.ts`, `SocketServer.ts`.

**6. 🧬 TDD & PROTOCOLO DE TESTING (Zona Verde):**
- **Prueba 1:** Arranque asíncrono confirmando que Node arranca y levanta `ALLOWED_ORIGINS` del `.env`, imprimiendo el Log de seguridad.
- **Prueba 2:** Protocolo Manual Asíncrono del Operador conectándose vía Wi-Fi o red 4G pública al enlace de Ngrok.

**7. 🔙 PLAN DE ROLLBACK (Safe-Exit Protocol):**
- **Condición de Detonación:** Bloqueo absoluto ("Invalid Host Header" imposible de revertir).
- **Protocolo Revert:** `git reset --hard HEAD` hacia la era puramente Localhost correspondiente al cierre de ST-05.
