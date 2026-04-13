# 🏛️ CMDM: Central Móvil De Mando - Visión y Alcance

## 1. Resumen Ejecutivo
La **CMDM** es una aplicación web independiente que actúa como interfaz de mando móvil. Su única función es conectar al operador con el Búnker de IA local (Anti-Gravity + OLAma) y el Arquitecto remoto (Google AI Studio), facilitando la lectura de archivos, la intercesión humana, el ahorro de tokens y la operación manos libres mediante voz.

## 2. Definición del Problema
*   **Falta de Movilidad:** Necesidad de estar frente al PC para leer qué respondió la IA o qué archivos cambió.
*   **Verbocidad:** Las respuestas de Google AI Studio o del Búnker son largas y gastan tokens si se re-envían sin filtrar.
*   **Riesgo de Continuidad:** Si el chat se cierra o el sistema se apaga, el usuario pierde el hilo de "en qué punto exacto" se quedó la tarea.
*   **Fricción de Entrada:** Escribir instrucciones técnicas largas en un teclado móvil es ineficiente y propenso a errores.

## 3. Pilares del Proyecto
1.  **Soberanía del Operador:** La CMDM permite ver, copiar y enviar información entre las IAs de forma manual y controlada.
2.  **Protocolo Cavernícola (Eficiencia):** Herramienta para comprimir el texto verboso antes de pegarlo en Google AI Studio o el Búnker.
3.  **Fidelidad Socrática:** El proceso de compresión debe mantener las preguntas y dudas que fuerzan a la IA a deducir, eliminando solo la paja.
4.  **Costo Cero:** Uso de tecnologías gratuitas (Web Speech API nativa de Chrome) y procesamiento local.
5.  **Operación de Campo (Ubicuidad):** Integración de comandos de voz (STT) y lectura de respuestas (TTS) para permitir que el operador dicte órdenes y escuche dictámenes mientras se mueve.

## 4. Alcance del MVP (Lo mínimo para funcionar)
*   **Lector de Búnker:** Pantalla para ver el chat y los logs del búnker actual (Anti-Gravity + OLAma).
*   **Escritor de Instrucciones Dual:** Caja de texto para enviar órdenes al Búnker o preguntas al Arquitecto con soporte de dictado por voz.
*   **Motor de Audio (Chrome Exclusive):** Botón de micrófono para dictado y botón de escucha para lectura auditiva de respuestas.
*   **Agregador de Archivos (.txt):** Botón para juntar los archivos modificados por la IA en un solo texto plano.
*   **Persistencia de Sesión:** Registro de "último paso realizado" (Engrama) para retomar el trabajo tras un cierre inesperado.