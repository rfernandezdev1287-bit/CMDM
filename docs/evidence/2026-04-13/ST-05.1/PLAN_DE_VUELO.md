### 🚀 PLAN DE VUELO: ST-05.1 (Voice Engine TTS Refactor & Estabilización)

**1. 🧠 INGESTIÓN DE MEMORIA (Lecciones de Guerra):**
*Sintetizado de fallas y rigores legales recientes:*
- "Falla detectada: El TTS del navegador falla en silencio (audio fantasma). El Garbage Collector aniquila variables TTS asíncronas no persistidas, y el `.cancel()` entra en colisión de carrera en V8."
- "Lección de guerra 1: Cero Parches Temporales. No se permite ocultar el bug con un `try/catch` vacío o un re-intento sucio. Se debe reescribir atómicamente el hook."
- "Lección de guerra 2: Prevención Estructural. Todo documento de diseño riesgoso exige un Plan de Rollback atado a su cola."

**2. 📑 TRAZABILIDAD DE DOCUMENTACIÓN (Source of Truth):**
- **Requerimiento:** Solución Arquitectónica Definitiva para Bucle de Voz (ST-05).
- **Estándares Aplicados:** `docs/skills/rfdevlaw.md` -> [Módulos: Cero Mocks/Parches, Mandato de Detalle Total].
- **Módulos Afectados:** `frontend/src/application/hooks/useCMDM_Voice.ts`.

**3. 🏛️ FASE SOCRÁTICA (Análisis de Riesgos):**
- **Duda Metódica:** "¿Qué pasa si forzamos 'es-MX' pero la PC del usuario no lo tiene y aborta en silencio por falta de modelo de voz físico?"
- **Solución:** Ejecutar `window.speechSynthesis.getVoices()` de manera enlazada para buscar paquete de idioma latino (`es-MX`, `es-US`, `es-ES`) validando la caída.
- **Punto de Falla (Race Condition):** Si cancelamos un audio previo y mandamos otro al mismo milisegundo, Chromium descarta los dos. *Acción: Usaremos un `setTimeout` táctico (50ms) entre anulación y reemisión.*
- **Punto de Falla (React GC):** Pérdida de variable de contexto *utterance*. *Acción: Refactorizando de variable local a estado o arreglo persistente dentro del hook (Anti-GC).*

**4. 🧪 FÓRMULA TÉCNICA (Inducción Activa):**
"Refabricaremos el hook `useCMDM_Voice.ts` por completo, sin usar parches. Crearemos el motor de TTS separando la carga asíncrona de voces del disparador de emisión. El objeto `SpeechSynthesisUtterance` estará blindado en alcance, inyectado con callbacks `.onend` y `.onerror` reales para romper con el anti-patrón de ceguera silenciosa. Todo el flujo queda aislado y probado en TDD sin tocar la integridad del Dashboard."

**5. 🚦 TABLA DE ESTADOS:**
| ID | Tarea Atómica | Requerimiento | Estado |
|:---|:---|:---|:---:|
| T-01 | Hardware | Binding dinámico de Voces Nativas (`getVoices`) | 🔴 PENDIENTE |
| T-02 | Core | Refactor anti-Garbage Collection (Persistencia de Instancia) | 🔴 PENDIENTE |
| T-03 | Estabilidad | Desacople Temporal: Micro-Delay tras `.cancel()` | 🔴 PENDIENTE |
| T-04 | Certificación | Escucha física de parlantes en Puerto 8080 | 🔴 PENDIENTE |

**6. 🧬 TDD & PROTOCOLO DE TESTING (Zona Verde):**
- **Prueba 1 (Frontend Hook Test):** `useCMDM_Voice.test.ts`
  - *Contexto:* Mock integral del objeto `window.speechSynthesis`.
  - *Afirmación:* `reproducirRespuesta` debe invocar `.getVoices()`, purgar el buffer (`cancel`), emitir spy timers y finalmente disparar `.speak()` en la instancia.
- **Prueba 2 (Operador Autónomo):** Pruebas de última milla (sensorial) confirmando sonido frente al hardware final.

**7. 🔙 PLAN DE ROLLBACK (Safe-Exit Protocol):**
- **Condición de Detonación (Trigger):** Si tras aplicar la refactorización el audio de Chromium provoca cuelgues (`frozen thread`) o colapsa el Event Loop del Dashboard inhabilitando la comunicación de sockets y voz.
- **Protocolo de Restauración:** 
  1. Ejecución inmediata de revert atómico al hash anterior funcional: `git checkout HEAD frontend/src/application/hooks/useCMDM_Voice.ts`.
  2. Restauración de los test a su commit en Verde original (`ST-04` / `ST-05 base`).
- **Estado Fallback:** Retorno al sistema de micrófono STT operativo (sin motor de lectura automática TTS) garantizando que el operador pueda seguir guiando el Búnker sin romper la operación manual central.
