# 🏛️ CMDM: Especificación Funcional y No Funcional

## 1. Módulo de Interfaz (Frontend - Mobile First)
*   **RF-01 (Dual Chat Display):** Visualización independiente de los hilos de Anti-Gravity y el Arquitecto.
*   **RF-02 (Input Inteligente):** Caja de texto con switch de destino: [Hacia Búnker] o [Hacia Arquitecto].
*   **RF-03 (Quick Clipboard):** Botones en cada burbuja de chat para "Copiar al Input" instantáneamente.
*   **RF-04 (Diseño Gold):** Interfaz Glassmorphism (blur 16px, transparencia alpha, bordes 24px).
*   **RF-11 (Vocal Input):** Botón de micrófono que utiliza la `WebSpeech API` de Chrome para transcribir voz a texto directamente en el input maestro.
*   **RF-12 (Audio Feedback):** Botón de altavoz en cada mensaje para sintetizar voz (TTS) y leer el contenido al Operador.

## 2. Módulo de Procesamiento y Memoria
*   **RF-05 (Motor de Síntesis):** Integración local para comprimir texto antes de enviar (Protocolo Cavernícola).
*   **RF-06 (Vigilante de Búnker):** Backend (Node/Chokidar) que monitorea los archivos de log/stream de Anti-Gravity y OLAma.
*   **RF-07 (Gestor de Engramas):** Persistencia automática en archivos .md en la carpeta `.agent/engram/`.
*   **RF-08 (SSD Loader):** Selector de proyectos que carga el `RFDEV-Architect-Law` específico de cada búnker.

## 3. Requerimientos No Funcionales (RNF)
*   **RNF-01 (Latencia):** Cambios en el búnker deben reflejarse en el móvil en < 500ms.
*   **RNF-02 (Bajo Consumo):** Watcher < 1% CPU en reposo.
*   **RNF-04 (Hermetismo):** Aislamiento total de datos por PATH de proyecto.
*   **RNF-05 (Cero Nube):** Prohibido enviar datos a terceros, excepto la API de Gemini bajo compresión. La voz se procesa localmente en Chrome.
*   **RNF-06 (Tunneling):** Uso obligatorio de ngrok con HTTPS para habilitar las APIs de voz en móviles.
*   **RNF-10 (Diseño Gold):** Respeto absoluto al manual de identidad visual RFDEV.