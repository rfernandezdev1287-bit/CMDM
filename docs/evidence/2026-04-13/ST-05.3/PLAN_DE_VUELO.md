### 🚀 PLAN DE VUELO: ST-05.3 (Voz Búnker: Remediación Dead Man's Switch)

**1. 🧠 INGESTIÓN DE MEMORIA (Lecciones de Guerra):**
*Sintetizado de Autopsias anteriores:*
- "Dato Técnico Descubierto: El API nativo de `SpeechSynthesis` en WebKit/macOS ocasionalmente se 'cuelga' si procesa un AudioContext inicial ("Warm-up bala de fogueo") muy rápido o sin sonido fluido, ignorando el disparo de los eventos `onstart` y `onend`. Esto produce un bloqueo lógico asíncrono permanente en nuestro Queue."
- "Regla de Evitación: Jamás confiar ciegamente en que las Web APIs de Hardware dispararán sus Promesas o Callbacks de finalización (`onend`). Las arquitecturas Frontend dependientes de hardware externo (Mic o Parlantes) deben implementar un 'Dead Man's Switch' (Temporizador de Supervivencia)."

**2. 📑 TRAZABILIDAD DE DOCUMENTACIÓN (Source of Truth):**
- **Módulo Principal:** `frontend/src/application/hooks/useCMDM_Voice.ts`
- **Dependencia de Interfaz:** `frontend/src/presentation/components/Dashboard/Dashboard.tsx`
- **Docs de Arquitectura:** `docs/skills/rfdevlaw.md` (Doctrina de Fixes y Protocolos Resilientes).

**3. 🏛️ FASE SOCRÁTICA (Análisis de Riesgos):**
- **Duda Metódica:** ¿Por qué reemplazar el Warm-up actual no solucionó todo? Si usamos "1 milisegundo de audio", Chrome puede obviar la creación del buffer de audio e ignorar los hooks de ciclo de vida, dejándonos ciegos.
- **Fórmula de Resolución Síncrona:** El "Warm-up" debe ser reemplazado por un reset puro `cancel()` + `resume()` detonado Síncronamente en el click. Por otro lado, la cola de audios reales (los largos) estará custodiada por un temporizador. Si `onend` no llega luego de [X] milisegundos calculados según el largo del string, matamos manualmente la espera y pasamos al siguiente.

**4. 🧪 FÓRMULA TÉCNICA (Inducción Activa):**
"En lugar de delegar el estado de desocupación (`isSpeakingRef.current = false`) puramente al evento C++ de Chrome, el algoritmo empleará un Supervisor Asíncrono (`setTimeout`). El supervisor monitoreará cada audio encolado (Patrón Timeout). Si la Web API enmudece, forzará el salto a la siguiente instrucción, evitando el silencio eterno."

**5. 🚦 TABLA DE TRAZABILIDAD:**
| ID | Dominio | Tarea Atómica | Estado |
|:---|:---|:---|:---:|
| T-01 | Hardware | Purga Bruta de Warm-up (`cancel`+`resume` en click explícito) | 🔴 PENDIENTE |
| T-02 | Hook | Inyección de Temporizador 'Dead Man Switch' (DMS) | 🔴 PENDIENTE |
| T-03 | Core | Cálculo de Timeout dinámico basado en Tokens/Caracteres | 🔴 PENDIENTE |
| T-04 | Automatización | Refactorizar TDD probando la resiliencia del Timeout | 🔴 PENDIENTE |

**Requerimiento:** Hotfix ST-05.3 - Blindaje del Queue Asíncrono del TTS.
- **Estándares Aplicados:** Basado en `docs/skills/rfdevlaw.md`: "Gestión Quirúrgica de Errores y Protocolos de Falla Limpia."
- **Módulos Afectados:** `useCMDM_Voice.ts` -> Capa de Hooks.

**6. 🧬 TDD & PROTOCOLO DE TESTING (Zona Verde):**
- **Prueba 1:** `useCMDM_Voice.test.ts` que validará la purga bruta y probará que el timeout avanza la cola aunque `onend` nunca se dispare.
- **Prueba 2:** Protocolo Manual de Operatoría Limpia (Aguardando confirmación del usuario en Safari/Chrome macos).

**7. 🔙 PLAN DE ROLLBACK (Safe-Exit Protocol):**
- **Condición de Detonación:** Si el Timeout forzado hace que el navegador "entreactroce" las locuciones rompiendo la cadencia.
- **Protocolo Revert:** `git reset --hard HEAD` (Retiro a commit `67a8dd0`) y desactivación del motor Voz.
