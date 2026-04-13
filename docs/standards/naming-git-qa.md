# 🆔 RFDEV-Architect-Law: Naming, Git y Calidad

## 2.1. Spanglish Arquitectónico
*   **INFRAESTRUCTURA (Inglés):** Carpetas (`infrastructure/`), clases (`AuthService`), métodos técnicos (`update`).
*   **NEGOCIO (Español):** Entidades (`Repuesto`), Atributos (`precio_costo`), Rutas (`/reparaciones`). **PROHIBIDO** traducir el dominio del negocio.
*   **MANDATO NEUTRO:** Prohibido usar terminología técnica interna del desarrollo en la Interfaz de Usuario.

## 5.1. Calidad y TDD Estricto
*   **TDD ROJO:** **PROHIBIDO** escribir lógica sin un test previo en **ROJO** (Vitest).
*   **MUTATION CHECK:** Romper la lógica a propósito para verificar que el test falla.
*   **SANITY CHECK:** Antes de cerrar: `npm test` y `npm run lint`. Un solo Warning invalida la entrega.

## 6.1. Workflow y Git
*   **COMMITS ATÓMICOS:** Todo commit debe ser por dominio lógico. **PROHIBIDO God-Commit**.
*   **PRUEBA DE VIDA:** Tras cada commit, mostrar el hash real: `git log -1 --stat`.

## 7.6. El Centinela de Desconfianza (Anti-Alucinación)
*   **MANDATO DE DUDA:** El Agente tiene **PROHIBIDO** confiar en sus propios resultados. Debe forzarse a buscar un escenario donde el código falle antes de entregarlo.