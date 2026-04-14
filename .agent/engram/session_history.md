# 🚀 HISTORIAL DE SESIÓN: CMDM

## 🧠 LECCIONES DE GUERRA (Aprendizaje Continuo)
- **Aprendizaje clave:** La Ley RFDEV no admite omisiones en la lectura física; cualquier intento de resumen o salto de estándares resulta en la pérdida de rigor arquitectónico y el rechazo del operador.
- **Regla de evitación:** Prohibido iniciar la construcción sin el sello de aprobación del Operador tras el Plan de Vuelo.
- **Falla Crítica de Delegación:** Ejecución de código operativo (ST-02.1) omitiendo protocolo estricto de Arquitectura (Plan de Vuelo e Informe Final). Actuar fuera de la Ley compromete la soberanía. Acción correctiva: Restablecimiento de trazabilidad mediante ST-02.1-RECOVERY.
- **Aprendizaje clave (ST-05.1):** El TTS del motor Google V8 (Chromium) oculta fallos de *race conditions* con el método `.cancel()`. Insertar micro-pausas asíncronas (`setTimeout`) evade el colapso del buffer.
- **Regla de evitación (ST-05.1):** En arquitecturas de React (SPA), jamás dejar objetos nativos de hardware (`SpeechSynthesisUtterance`) en variables de scope asíncrono para evitar aniquilación silenciosa por Garbage Collection. Es perentorio el uso de referencias (`useRef`).
- **Aprendizaje clave (ST-05.2):** La "User Activation Policy" de Chrome bloquea instanciación dura de síntesis de voz desde flujos de red (como Socket recv). Una solución perenne es instanciar un 'Warm-up' mudo sincronizado al evento onClick `enviarOrden`.
- **Regla de evitación (ST-05.2):** Reemplazar `cancel()` global de la Web Speech API por estrategias de "Queue" (Cola pasiva) dentro de React si el objetivo final no es silenciar de emergencia sino espaciar lecturas.
- **Aprendizaje clave (ST-05.3):** El motor WebSpeech de macOS falla silenciosamente. **Nunca** delegar el 100% de la lógica a la promesa nativa (`onend`). 
- **Regla de evitación (ST-05.3):** Usar siempre un supervisor de tiempo (`Dead Mans Switch`) al interactuar con WebSpeech en arquitecturas de colas (SPA) para evitar un System Freeze.
- **Aprendizaje clave (ST-04):** En arquitecturas de Backend (Node v20), ESLint v9 requiere obligatoriamente una configuración física (`eslint.config.mjs`) para habilitar el Sanity Check automático; su ausencia bloquea la soberanía del búnker.
- **Regla de evitación (ST-04):** Prohibido acceder a valores de `useRef` durante el renderizado en React Hooks; el retorno debe ser estable o a través de un estado para evitar colapsos de memoria y advertencias tácticas.
- **Aprendizaje clave (Squeeze):** El filtrado agresivo ("Protocolo Cavernícola") de ruido verbal optimiza la ingestión del Arquitecto, reduciendo el overhead de red y aumentando la precisión focal del modelo.
- **Lección de Guerra (Remediación ST-04.5):** La resolución de rutas estáticas (`dist`) debe centralizarse mediante `path.resolve` para garantizar la soberanía física del búnker independientemente del directorio de trabajo.
- **Detección Táctica:** El error `NXDOMAIN` es el síntoma inequívoco de un desvío DNS (Typo en el dominio); en este caso, el uso de `.de` en lugar de `.dev` bloqueó el enlace frontal.
- **Aprendizaje clave (ST-04.7):** El compilador de TypeScript (v5.9+) no incluye definiciones nativas para `SpeechRecognition` por ser una API experimental. Es perentorio declarar interfaces explícitas (`SpeechRecognitionStatic`, `SpeechRecognition`) para garantizar la homogeneidad del build de producción.
- **Aprendizaje clave (ST-04.8):** El error `ERR_SSL_PROTOCOL_ERROR` se produce por asimetría de protocolos. En entornos seguros (HTTPS/ngrok), el `backend_url` debe ser siempre la URL del túnel con terminación SSL, incluso desde localhost, para evitar bloqueos del navegador.
- **Aprendizaje clave (ST-04.9):** El motor de compresión ("Squeeze") requiere una estrategia de **Lista Negra** (eliminar ruido verbal explícito) en lugar de una Lista Blanca restrictiva. Esto permite que las observaciones fácticas y anotaciones de trazabilidad fluyan hacia la UI sin ser amputadas por el algoritmo.
- **Regla de evitación (ST-04.7):** Prohibido duplicar propiedades en los mocks de tests de hardware; la duplicidad bloquea catastróficamente el proceso de buildeo estricto (`tsc -b`).
- **Estado Inicial:** Repositorio Git vinculado a `https://github.com/rfernandezdev1287-bit/CMDM.git`.

## 🚦 TABLA DE EVENTOS
| Fecha | Tarea | Resultado |
|:---|:---|:---:|
| 2026-04-13 | `/sdd-init` | 🟢 COMPLETADO |
| 2026-04-13 | Lectura Física Exhaustiva (Ley y Specs) | 🟢 COMPLETADO |
| 2026-04-13 | Saneamiento ST-01.2.1 (Vulnerabilidades) | 🟢 COMPLETADO |
| 2026-04-13 | **ST-01: Backend Core & Watcher** | 🟢 SELLADO |
| 2026-04-13 | **ST-02.1-RECOVERY (Base Frontend & Theme Gold)** | 🟢 COMPLETADO |
| 2026-04-13 | **ST-02.2: Voice Engine & Socket Bridge** | 🟢 COMPLETADO |
| 2026-04-13 | **ST-03: Dashboard UI & Mando de Cristal** | 🟢 COMPLETADO |
| 2026-04-13 | **ST-05 & ST-05.1: Voice Engine & TTS Hotfix (Detonado)** | 🟡 ROLLBACK |
| 2026-04-13 | **ST-05.2: TTS Remediación Definitiva (Warm-Up)** | 🟢 COMPLETADO |
| 2026-04-13 | **ST-05.3: TTS Supervisor Dead Man's Switch** | 🟢 COMPLETADO |
| 2026-04-13 | **ST-04: Cerebro de Intercesión & Squeeze Engine** | 🟢 SELLADO |
| 2026-04-13 | **ST-04.1: Saneamiento de Calidad (Sanity Check)** | 🟢 COMPLETADO |
| 2026-04-13 | **ST-03.7: Puente de Rigor (Live Proxy)** | 🔴 ABORTADO |
| 2026-04-13 | **ST-04.5: Auditoría de Arsenal y Remediación** | 🟢 SELLADO |
| 2026-04-13 | **ST-04.7: Remediación de Tipado y Arsenal Estático** | 🟢 SELLADO |
| 2026-04-13 | **ST-04.8: Resolución de Conflicto SSL y Enlace Soberano** | 🟢 SELLADO |
| 2026-04-13 | **ST-04.9: Refinamiento del Cerebro de Intercesión** | 🟢 SELLADO |
| 2026-04-14 | **ST-05: Sincronía Inicial y Sello de Veracidad** | 🟢 SELLADO |
| 2026-04-14 | **ST-08: Blindaje de Jerarquía y Estética Gold** | 🟢 SELLADO |
| 2026-04-14 | **ST-08.1/08.2: Remediación de Build y Linter** | 🟢 SELLADO |
| 2026-04-14 | **ST-09.0: Sincronía Vocal y Arsenal de Cristal** | 🟢 SELLADO |
| 2026-04-14 | **ST-09.2: Unicast Táctico y Soberanía Visual** | 🟢 SELLADO |

## 🧠 LECCIONES DE GUERRA (ST-05)
- **Aprendizaje clave (Caveman v3):** La simplificación lingüística agresiva (eliminación de el/la/de/un) no compromete la lógica si se anclan los signos de interrogación y los verbos de deducción.
- **Aprendizaje clave (Audit):** El firmado forense en `.agent/audit.json` permite al búnker diferenciar entre cambios generados por la IA y contribuciones humanas, garantizando la soberanía de los datos.
- **Regla de evitación:** Prohibido que la aplicación inicie sin un overlay de sincronización; la incertidumbre del operador respecto al estado del engrama es una vulnerabilidad táctica.
- **Lección de Trazabilidad:** El uso de alias (`@infrastructure`) en TypeScript resuelve conflictos de `rootDir` al mover tests a subcarpetas de auditoría, manteniendo el build limpio.

## 🛡️ ALERTAS DE SEGURIDAD
- **Incidentes:** Resolución de error `TS2322` en `FileWatcher.ts` (Callback tipado estrictamente).
- **Hito:** Arsenal consolidado vía `git status --porcelain` disponible en Dashboard.


rfdev estuvo aquí, prueba final búnker 2222 44 55La IA está probando sincronización: Mon Apr 13 18:02:15 CST 2026
Hito Socrático de Sincronización: Mon Apr 13 18:03:30 CST 2026
Certificación de Sincronización Socrática: Mon Apr 13 18:04:13 CST 2026
Prueba Final de Sincronización (Fix contenido_bruto): Mon Apr 13 18:04:48 CST 2026
Test Watcher: Mon Apr 13 18:11:24 CST 2026 test
Verificación Socrática Final: Mon Apr 13 18:19:49 CST 2026 ffff
- **Lección Táctica: Definición de Interacción (Soberanía del Operador)**: No se debe equiparar "línea" con "interacción". Una interacción en el CMDM es el binomio indisoluble (Comando + Respuesta). Calcular sincronía basándose en líneas planas es una violación de la soberanía contextual del Operador.
- **Falla Forense: Verificación de Scroll y Jerarquía Flex**: Un reporte de "Verde Inmaculado" es un engaño si no se verifica físicamente que el contenedor tiene una restricción de altura (`min-height: 0`). El auto-scroll puede engañar a la vista ocultando que el contenedor se está expandiendo infinitamente.
- **Protocolo de Verificación Rigurosa**: Antes de certificar, inyectar manualmente un volumen de datos que exceda el viewport y confirmar la aparición de la barra de scroll y el trigger de Lazy Loading.
- **Aprendizaje clave (ST-08.0):** El blindaje de estanqueidad de texto (`overflow-wrap: anywhere`) es vital para evitar el colapso del búnker ante comandos sin espacios en viewports reducidos.
- **Regla de evitación (ST-08.0):** Prohibido el `scroll-behavior: smooth` durante la expansión de historia prepended; el bypass a `auto` garantiza la estabilidad absoluta del scroll.
- **Rigor de React 19 (ST-08.1/08.2):** Saneamos el build eliminando estados derivados innecesarios e implementando inicialización perezosa para sockets, garantizando un linter inmaculado.
- **Aprendizaje clave (ST-09.0):** El motor de voz (TTS) requiere un protocolo de **Encolamiento Nativo (Queue)**. El uso de `cancel()` preventivo aniquila la dualidad de respuesta (Ack + Exec) necesaria para la soberanía del Operador.
- **Regla de evitación (ST-09.0):** Prohibido tratar código fuente como lenguaje natural. El Squeeze Engine debe implementar **Marcadores de Inviolabilidad** (`<<< ARTIFACT >>>`) para proteger los planos técnicos de la amputación Caveman.
- **Lección Táctica (ST-09.0):** El botón de Stop debe ser absoluto, silenciando tanto el dictado como la cola de voz pendiente para devolver el control inmediato al Operador.
- **Aprendizaje clave (ST-09.2):** El feedback táctico de comandos requiere un protocolo de **Unicast** (`socket.emit`). El uso de Broadcast (`io.emit`) genera duplicidad de eventos (Eco Fantasma) en redes con latencia o múltiples sesiones.
- **Regla de evitación (ST-09.2):** Prohibido amputar herramientas de soberanía (Copy Icon) durante refactorizaciones estéticas; la ergonomía del Operador es innegociable.
- **Protocolo de Rigor (ST-09.2):** Los Planes de Vuelo deben ser "Saciados" (completos), incluyendo análisis socrático y tabla de trazabilidad según la Ley RFDEV Módulo 0.
