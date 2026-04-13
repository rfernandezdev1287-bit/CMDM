---
name: rfdev-architect-law
description: Master Skill pra los desarrollos realizados por RFDEV. Orquesta el flujo SDD entre Anti-Gravity, Ollama y el Operador.
---

# 🛡️ RFDEV-Architect-Law: El Contrato del Agente (Módulo 0)

## 0.0. A1: El Pacto de Rigor (Zero-Laziness Protocol)
*   **LECTURA EXHAUSTIVA:** El Agente tiene **PROHIBIDO** resumir. Cada módulo debe ser escaneado **LETRA POR LETRA**.
*   **MANDATO DE DETALLE TOTAL:** Prohibido el uso de comentarios tipo `// ...`. El código debe entregarse **COMPLETO**, atómico y funcional. No se aceptan mocks ni parches temporales.
*   **FICHA TÉCNICA ACTIVA:** Stack: **Node v20 (LTS)**, **Express.js**, **TypeORM/MySQL**, **React v19**, **MUI v7**, **React Hook Form + Yup/Zod**.

## 0.1. R1: Fuente de Verdad y Trazabilidad
*   **LECTURA FÍSICA OBLIGATORIA:** Antes de cada Plan de Vuelo, el Agente **DEBE** ejecutar `cat` sobre los archivos de estándares indicados.
        `todos los archivos dentro de la carpeta docs/standards y  docs/requerimientos del respectivo proyecto que se esta trabajando(veficar contra caperta raiz del proyecto)` y todos los achivos en la carpeta `cmdm-suite/docs/standards`
    **SEMÁFORO DE ESTADOS:** 
    - 🔴 **PENDIENTE:** Identificada pero no aplicada.
    - 🟡 **EN PROCESO:** Ejecutándose en el bloque actual.
    - 🟢 **COMPLETADO:** Verificada físicamente (test/cat/ls) y con evidencia guardada.

## 0.2. R2: Ingestión de Memoria y Aprendizaje (Engramas)
*   **BUCLE DE APRENDIZAJE:** Antes del plan, leer físicamente `.agent/engram/session_history.md`.
*   **LECCIONES DE GUERRA:** El Plan de Vuelo **DEBE** incluir las secciones:
        ### 🚀 PLAN DE VUELO: [NOMBRE_DE_LA_TAREA]
            **1. 🧠 LECCIONES DE GUERRA (Aprendizaje Continuo):**
            *Sintetizado de .agent/engram/session_history.md:*
            - "Error previo detectado: [Breve descripción de un error pasado]."
            - "Acción correctiva: [Cómo se evitará repetir el error en esta tarea]."

            **2. 🏛️ FASE SOCRÁTICA (Análisis de Riesgos):**
            - **Suposiciones:** "Se asume que [Contexto técnico X] está disponible y configurado."
            - **Punto de Falla A:** "¿Qué sucede si la entrada de datos es nula o malformada?"
            - **Punto de Falla B:** "¿Cómo afecta esta lógica a la escalabilidad o al rendimiento del sistema?"

            **3. 🚦 TABLA DE TRAZABILIDAD:**
            | ID | Dominio | Tarea Atómica | Estado |
            |:---|:---|:---|:---:|
            | T-01 | [Capa/Módulo] | [Descripción breve de la sub-tarea] | 🟡 EN PROCESO |
            | T-02 | [Capa/Módulo] | [Descripción breve de la sub-tarea] | 🔴 PENDIENTE |
            **Requerimiento:** (Basado en `docs/requirements/[Archivo].md`): "[ID_Req] - [Descripción del requerimiento a cumplir]."
            - **Estándares Aplicados:** (Basado en `docs/standards/[Archivo].md`): "[Nombre_Ley] - [Regla específica, ej: Atomicidad/Naming]."
            - **Módulos Afectados:** (Basado en `docs/requirements/04_mapa_de_modulos.md`): "[Nombre_Modulo] -> [Capa DDD]."


            **4. 🧪 FÓRMULA TÉCNICA (Inducción Activa):**
            *Razonamiento sugerido por la IA para evitar la pereza:*
            "Se propone aplicar el patrón [Nombre del Patrón, ej: Singleton/Factory/DTO] para garantizar la homogeneidad. La lógica central consistirá en [Explicación técnica de la solución] antes de proceder con el código real."

            
            **5. 🧠 LECCIONES DE GUERRA APLICADAS"** con síntesis de riesgos basada en fallos pasados para evitar la repetición de          errores.


**.REPORTE DE EVIDENCIA:** Tras finalizar, depositar prueba de funcionamiento en `docs/evidence/[YYYY-MM-DD]/[ID_TAREA]/[NOMBRE_DESCRIPTIVO.md]`. Sin evidencia no hay sello de "Completado".

## 0.9. Protocolo Socrático e Inducción Activa
*   **MAYÉUTICA DE INDUCCIÓN:** El Agente no debe ser un ejecutor pasivo. Debe proponer la solución basada en la ley: *"Siguiendo el patrón DDD y los estándares de este búnker, la respuesta correcta es X. ¿Deduce algún fallo en esta lógica antes de proceder?"*.
*   **MÉTODO 3F (Falla-Fórmula-Feedback):** 
    1. **Falla:** Identificar el punto exacto de error o ineficiencia.
    2. **Fórmula:** Explicar la lógica en pseudocódigo o razonamiento antes de escribir TypeScript.
    3. **Feedback:** Validar que la solución no genera un "collage" técnico y es homogénea con el resto del proyecto.

## 0.7. W1: Comandos Operacionales Gold
1. **"Saca la biblia [Dom]: [Nom] | [Desc]"**: Activa la carga JIT y Fase Socrática, lectura y carga en memoria del archivo docs/rfdevlaw.md (**este archivo es solo de lectura no se modifica bajo ninguna circunstacncia**).
2. **"Punto de Control"**: Re-sincronización física con el Engrama y la Ley.
3. **"Aplica la ley con rigor"**: Inicia construcción atómica bajo TDD Rojo.
4. **"Cierra la biblia"**: Higiene de procesos, Commits Atómicos y actualización de Historial, entregar del informe final con el siguiente formato:

    ### 🏁 REPORTE FINAL: [NOMBRE_DE_LA_TAREA]

        **1. 🧪 PRUEBA DE VIDA (Validación Real):**
        - **Resultado de Ejecución:** [Logs de terminal, resultados de tests o salida del proceso].
        - **Trazabilidad Git:** `git log -1 --stat` (Hash y archivos afectados).

        **2. 📁 SELLO DE EVIDENCIA:**
        - **Ruta:** `docs/evidence/[nombre_archivo_evidencia].txt`
        - *Descripción:* "Documentación física del éxito de la tarea según el estándar de calidad."

        **3. 🧹 HIGIENE Y CALIDAD:**
        - [x] Análisis estático realizado (Linting sin errores).
        - [x] Verificación de homogeneidad (El código sigue el estilo del resto del búnker).
        - [x] Limpieza de procesos y recursos zombies finalizada.

        **4. 🧠 ACTUALIZACIÓN DE ENGRAMA (Memoria Técnica):**
        *Registrado en .agent/engram/session_history.md:*
        - "Aprendizaje clave: [Dato técnico nuevo descubierto durante el desarrollo]."
        - "Regla de evitación: [Instrucción para que la IA no cometa el mismo error en el futuro]."

        *5. 🚦 TABLA DE TRAZABILIDAD actualizada con las tareas exitosas marcdas como 🟢 **COMPLETADO:**
