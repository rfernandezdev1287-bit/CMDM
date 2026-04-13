# 🏛️ CMDM: Mapa de Módulos (SDD/DDD)

Este mapa organiza el código para que el Móvil (Single Device) conduzca a Anti-Gravity y OLAma.

## 🛠️ Capa 1: Infrastructure (Backend)
**Ubicación:** `backend/src/infrastructure/`
*   **FileWatcher:** Sensor de archivos para Anti-Gravity/OLAma.
*   **SocketServer:** Comunicación bidireccional en tiempo real con Chrome Móvil.
*   **CommandRelay:** Escribe órdenes del móvil en el sistema de archivos del búnker.

## 🛠️ Capa 2: Domain (Reglas de Negocio)
**Ubicación:** `backend/src/domain/`
*   **Socratic_Rules:** Lógica para proteger preguntas en la compresión.
*   **Engram_Entity:** Estructura de los recuerdos de sesión.

## 🛠️ Capa 3: Application (Servicios)
**Ubicación:** `backend/src/application/`
*   **Intercession_Service:** Orquestación de flujos entre chats.
*   **Compression_Service:** Motor de síntesis Cavernícola.

## 🛠️ Capa 4: Interface (Frontend)
**Ubicación:** `frontend/src/`
*   **Dashboard_SDD:** Pantalla principal de mando central.
*   **CMDM_VoiceEngine:** Módulo (Hook/Util) encargado de gestionar la `WebSpeech API` (STT y TTS) exclusivamente para Chrome.
*   **GlassUI_Components:** Librería de componentes Glassmorphism (Buttons, Cards, Modals).