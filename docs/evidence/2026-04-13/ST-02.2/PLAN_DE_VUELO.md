### 🚀 PLAN DE VUELO: ST-02.2 (Voice Engine & Socket Bridge)

**1. 🧠 LECCIONES DE GUERRA (Aprendizaje Continuo):**
*Sintetizado de .agent/engram/session_history.md:*
- "Error previo detectado: Ejecución de código omitiendo protocolo estricto de Arquitectura. Ausencia de planes y documentación técnica."
- "Acción correctiva: Frenar en seco la materialización de los hooks de Socket y STT/TTS; someter la arquitectura a revisión humana mediante este Plan de Vuelo. Ejecución sólo tras autorización por Sello de Soberanía."

**2. 🏛️ FASE SOCRÁTICA (Análisis de Riesgos):**
- **Suposiciones:** Se asume conectividad robusta o capacidad de fallback a Localhost:9000 para enlazar al túnel de intercepciones. Se asume que el navegador Chrome local habilitará las System APIs (WebSpeech). 
- **Punto de Falla A:** ¿Qué ocurre si la red WiFi cambia abruptamente y perdemos el WebSocket? Muerte súbita de flujo. *Solución: Políticas infinitas de ReconnectionDelay en el lado del cliente (socket.io).*
- **Punto de Falla B:** Bloqueo pasivo de sockets ante reconexión. *Solución: Sello de Reconexión Ofensiva acoplando un eventListener puro de 'online' directamente al DOM window para forzar reactivación milimétrica.*
- **Punto de Falla C:** Vociferación ruidosa de discursos atrasados si el TTS del sistema se ahoga en cola y genera un solapamiento con la próxima respuesta del sistema. *Solución: Aplicar `window.speechSynthesis.cancel()` rigurosamente antes del play de todo TTS.*

**3. 🚦 TABLA DE TRAZABILIDAD:**
| ID | Dominio | Tarea Atómica | Estado |
|:---|:---|:---|:---:|
| T-01 | Infraestructura | Hook useCMDM_Socket (Conexión al 9000 & Sello Ofensivo) | 🟡 EN PROCESO |
| T-02 | Aplicación | Hook useCMDM_Voice (STT con interimResults y TTS filtrado) | 🟡 EN PROCESO |
| T-03 | Interfaz | Dashboard Minimalista y enchufe de UI | 🔴 PENDIENTE |
- **Requerimiento:** (Basado en `docs/requirements/03_especificacion_funcional.md`): "[RF-11/12] - Vocal Input & Audio Feedback para dictado y síntesis en Chrome."
- **Estándares Aplicados:** (Basado en `docs/standards/naming-git-qa.md`): "Spanglish Law - Nomenclaturas como `iniciarDictado` y `reproducirRespuesta`."
- **Módulos Afectados:** (Basado en `docs/requirements/04_mapa_de_modulos.md`): "frontend/src/application/hooks -> CMDM_VoiceEngine."

**4. 🧪 FÓRMULA TÉCNICA (Inducción Activa):**
Se crearán hooks modulares `useCMDM_Socket` y `useCMDM_Voice`. El Hook de voz utilizará declaración explícita de `window.SpeechRecognition` omitiendo dependencia de librerías terceras inseguras; garantizando compilación y resiliencia local en el browser sin latencia extraída por apis REST externas. El STT volcará buffers interim y el TTS validará purgas antes de la comunicación forzando configuración es-ES.
