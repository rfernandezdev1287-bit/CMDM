### 🚀 PLAN DE VUELO: ST-05.2 (Voz Búnker: Remediación de Restricciones del SO)

**1. 🧠 INGESTIÓN DE MEMORIA (Lecciones de Guerra):**
*Sintetizado de Autopsia a0d324d:*
- "Dato Técnico Descubierto: El evento error `canceled` con `isTrusted: true` no era un GC nativo, sino un bloqueo duro de Política de Autoplay o Event Loop colapsado. Al intentar emitir un audio derivado de un Thread asíncrono (WebSockets), macOS/Chromium abortó la instancia de `SpeechSynthesis`."
- "Regla de Evitación: Jamás asumir que el TTS funcionará de forma asíncrona (Post-Socket) sin antes hacer un **Unlock (Warm-Up)** del AudioContext asociado a una interacción síncrona real del usuario (OnClick)."

**2. 📑 TRAZABILIDAD DE DOCUMENTACIÓN (Source of Truth):**
- **Módulo Principal:** `frontend/src/application/hooks/useCMDM_Voice.ts`
- **Componente Desencadenante:** `frontend/src/presentation/components/Dashboard/Dashboard.tsx`

**3. 🏛️ FASE SOCRÁTICA (Análisis de Riesgos):**
- **Duda Metódica:** ¿Cómo sorteamos el bloqueo estricto del navegador si la emisión proviene del Socket (`bunker_response`) y el 'User Activation Token' ya caducó?
- **Fórmula de Resolución Síncrona:** Inyectaremos un "Desbloqueador de Canales". Al momento exacto en que el operador hace Click en `enviarOrden`, mandamos a imprimir un string vacío `new SpeechSynthesisUtterance(" ")` a volumen 0. Esto enclava el permiso físico de voz de por vida a la pestaña actual.
- **Punto de Falla 2:** `getVoices()` es Asíncrono en sistemas UNIX. *Acción: Incorporar el listener `onvoiceschanged` para pre-calentar el arreglo en background.*

**4. 🧪 FÓRMULA TÉCNICA (Inducción Activa):**
"Modificaremos la firma del hook para exponer una función de `desbloquearMotorDeVoz()`. El componente `Dashboard` la llamará desde el botón 'Enviar' de manera SÍNCRONA. Al mismo tiempo, en el callback del Socket, usaremos un Queue Manager (Cola de eventos pura) para introducir la voz pasivamente sin disrupciones violentas tipo `.cancel()`, blindando el ciclo entero a largo plazo."

**5. 🚦 TABLA DE TRAZABILIDAD:**
| ID | Dominio | Tarea Atómica | Estado |
|:---|:---|:---|:---:|
| T-01 | Hardware | Módulo *Warm-Up* (Rompe-hielo de Autoplay) | 🔴 PENDIENTE |
| T-02 | Hardware | Implementación Evento `onvoiceschanged` | 🔴 PENDIENTE |
| T-03 | Frontend | Inyección al Ciclo React en Componente Dashboard | 🔴 PENDIENTE |
| T-04 | Core | Cola de Espera TTS (Eliminar `cancel()`) | 🔴 PENDIENTE |

**Requerimiento:** Basado en parche crítico de motor TTS: "Hotfix ST-05.2 - Desbloqueo del AudioContext nativo."
- **Estándares Aplicados:** Basado en `docs/skills/rfdevlaw.md`: "Resolución anti-mocks y pureza de interacciones asíncronas."
- **Módulos Afectados:** `useCMDM_Voice.ts` -> Capa de Hooks / `Dashboard.tsx` -> Capa de Presentación.

**6. 🧬 TDD & PROTOCOLO DE TESTING (Zona Verde):**
- **Prueba 1 (Frontend Test):** `useCMDM_Voice.test.ts` con mock de carga asíncrona de voces y validación de función "Warm-up".
- **Prueba 2:** Protocolo Manual de Operatoría Limpia. Clic en Búnker, envío, recepción y lectura física en alta fidelidad.

**7. 🔙 PLAN DE ROLLBACK (Safe-Exit Protocol):**
- **Condición de Detonación:** Cuelgue permanente del AudioContext, fuga de memoria inducida o desconexión asíncrona.
- **Protocolo Revert:** `git reset --hard HEAD` y anulación del Warm-up. Retorno estable al micrófono silente.
