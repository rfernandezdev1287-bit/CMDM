### 🚀 PLAN DE VUELO: ST-03.3 (Blindaje de Calidad TDD)

**1. 🧠 INGESTIÓN DE MEMORIA (Lecciones de Guerra):**
- *Fallo Crítico Asimilado:* Se permitió la codificación y despliegue del componente Sockets y la UI sin evidencia física de un marco de pruebas unitarias previo, resultando en falsos positivos temporales (Ej: Bloqueo Mixed Content, CORS) que debieron cazarse en retrospectiva. Operar sin probar la infraestructura es una negligencia técnica en el Búnker. La veracidad importa más que la estética.

**2. 📑 TRAZABILIDAD DE DOCUMENTACIÓN:**
- **Requerimiento:** Vinculado con `docs/requirements/03_especificacion_funcional.md` (RF-11/12 Conectividad Restrita).
- **Estándar:** Aplicación estricta de Ley Arquitectónica (Módulo 5.1 - TDD Rojo primero).
- **Módulos Afectados:** `frontend/vite.config.ts`, `frontend/src/application/hooks/__tests__/useCMDM_Socket.test.ts`, `backend/src/__tests__/cors.test.ts`.

**3. 🏛️ FASE SOCRÁTICA (Análisis de Riesgos):**
- **Duda Metódica:** Al instalar Vitest y JSDOM, ¿existen riesgos de colisión de dependencias con Vite y el bundler nativo?
- **Solución Deducida:** Por instrucción explícita del Operador, se utilizarán archivos de configuración completamente aislados (`vitest.config.ts`) para frontend y backend, evitando inyecciones de código de testing en la compilación pura de React y Node. Esto preserva el core sagrado.

**4. 🤖 DELEGACIÓN A SUB-AGENTES:**
- **Puesto Orquestador (Arquitecto):** Define la batería de pruebas y sanciona los tests en ROJO como válidos.
- **Puesto Ebanista (Anti-Gravity / Ollama):** Ejecuta la instalación con `npm i -D vitest jsdom @testing-library/react supertest` y codifica primeramente los archivos `*.test.ts` de infraestructura para hacerlos chocar deliberadamente en Rojo.

**5. 🚦 TABLA DE ESTADOS:**
| ID | Tarea Atómica | Requerimiento | Estado |
|:---|:---|:---|:---:|
| T-01 | Infraestructura | Instalación de `vitest`, `jsdom`, `@testing-library/react` (Frontend) y `supertest` (Backend) | 🔴 PENDIENTE |
| T-02 | Configuración | Creación de `vitest.config.ts` aislado para Back y Front | 🔴 PENDIENTE |
| T-03 | TDD (Rojo) | Redacción de test CORS (`cors.test.ts`) forzando error 403 / 500 origin | 🔴 PENDIENTE |
| T-04 | TDD (Rojo) | Redacción de test WSS (`useCMDM_Socket.test.ts`) forzando protocolo http nativo | 🔴 PENDIENTE |
| T-05 | TDD (Verde) | Sanity Check: `npm test` ejecutado exitosamente con coverage base | 🔴 PENDIENTE |

**6. 📂 INVENTARIO DE ARCHIVOS Y EVIDENCIA:**
- **Ruta Oficial de Evidencia:** `docs/evidence/2026-04-13/ST-03.3/TDD_GREEN_REPORT.md` (Para entregar al final).
- **Archivos de Testing:** Directorios `__tests__` a consolidarse físicamente tanto en `frontend/src` como en `backend/src`.
