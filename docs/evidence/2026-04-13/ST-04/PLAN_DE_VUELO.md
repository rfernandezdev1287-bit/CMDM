### 🚀 PLAN DE VUELO: ST-04 (El Cerebro - Módulo de Intercesión)

**1. 🧠 INGESTIÓN DE MEMORIA (Lecciones de Guerra):**
- *Fallo Asimilado:* El Operador señaló un `404 Not Found` en la raíz del servidor, que si bien es normativo en DDD, develó que la ruta de health-check estaba mal nombrada (`/health` en lugar de `/status`). Además, el dominio ngrok operaba bajo volatilidad (cambios de URL constantes).
- *Misión:* Fijar estáticamente `https://sympetalous-conformably-colin.ngrok-free.dev` en el CORS y los `.env`, renombrar el endpoint a `/status`, e incorporar el servicio de compresión cavernaria (CompressionService) que enlace el FileWatcher con el Búnker Visual.

**2. 📑 TRAZABILIDAD DE DOCUMENTACIÓN (Source of Truth):**
- Vinculado con la Especificación Funcional: **Intercepción de Flujo (Engrama)** y visualización en crudo.
- Estándares Aplicativos: Aplicación de la regla de *Thin Protocol/Data* (minimización de payloads) en la emisión del socket.

**3. 🏛️ FASE SOCRÁTICA (Análisis de Riesgos):**
- **Duda Metódica:** ¿Cómo conectamos un `FileWatcher` pasivo con un `SocketServer` activo sin romper la barrera de capas (Inversión de Dependencias)?
- **Solución Dedicada:** Inyectaremos la instancia del `SocketServer` (puerto `io`) en el `IntercessionService`. El servicio procesará el texto usando `CompressionService`, purgando texto plano para quedarse con las etiquetas de código y las directrices socráticas, para luego emitirlas asíncronamente con el evento `bunker_stream`.

**4. 🤖 DELEGACIÓN A SUB-AGENTES:**
- **Orquestador:** (Yo) Planifica, vigila el cumplimiento de las variables de entorno, el `404` y aprueba el Plan ST-04.
- **Ejecutor:** Editará `SocketServer.ts`, `backend/.env`, `frontend/.env`, creará `CompressionService.ts` y conectará la interfaz UI (`Dashboard.tsx` o Hook interno) al evento de transmisión.

**5. 🚦 TABLA DE ESTADOS:**
| ID | Tarea Atómica | Estado |
|:---|:---|:---:|
| T-01 | Renombramiento de endpoint `/health` a `/status` y ajuste de test de TDD. | 🔴 PENDIENTE |
| T-02 | Fijación Estática: inyectar `sympetalous-conformably-colin.ngrok-free.dev` en entornos. | 🔴 PENDIENTE |
| T-03 | Dominio: Implementar `CompressionService` (Depuración de paja verbal). | 🔴 PENDIENTE |
| T-04 | Infraestructura: Conexión entre `IntercessionService` e `IO.emit('bunker_stream')`. | 🔴 PENDIENTE |
| T-05 | Interfaz: Suscripción UI y parseo del buffer desde `Dashboard.tsx`. | 🔴 PENDIENTE |
| T-06 | Calidad: Validación TDD del CompressionService y flujo de Sockets. | 🔴 PENDIENTE |

**6. 📂 INVENTARIO DE ARCHIVOS Y EVIDENCIA:**
- `docs/evidence/2026-04-13/ST-04/PLAN_DE_VUELO.md`
- Core afectado: `IntercessionService.ts`, `SocketServer.ts`, `.env`, `Dashboard.tsx`
