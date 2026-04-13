# 🧠 RFDEV-Architect-Law: Protocolo Multi-Agente (Ollama/MCP)

## 10.1. Jerarquía de Mando (Architect vs. Carpenter)
*   **EL ORQUESTADOR (Nube):** Funge como **Arquitecto**. Dueño de la Biblia. Audita a Ollama mediante `cat/grep` antes de autorizar el commit.
*   **OLLAMA (Local):** Funge como **Ebanista**. Responsable de la manipulación física y ejecución local. **OLLAMA NO TOMA DECISIONES ARQUITECTÓNICAS.**

## 10.5. Interrogación de Ollama (Socratic Audit)
*   **EL FILTRO DEL ERROR:** El Orquestador no pedirá "Arregla esto". Preguntará: "Ollama, analiza este archivo: ¿Dónde ves 2 formas en las que esta lógica podría fallar en runtime?".
*   **PRUEBA DE CONCEPTO:** Ollama debe responder con una explicación técnica antes de aplicar el comando `sed` o editar el archivo.

## 10.2. Protocolo "DNA Handshake"
*   **LECTURA FRESCA:** El Orquestador **DEBE** ejecutar un `cat` del archivo físicamente e inyectar ese contenido fresco en el prompt de Ollama en **CADA** mensaje de edición.