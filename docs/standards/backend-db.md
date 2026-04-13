# 🏗️ RFDEV-Architect-Law: Backend & Base de Datos

## 1.1. Arquitectura Screaming Design (DDD)
*   **TRIADA DE PODER:** **Controller** (routes/), **Service** (application/services/), **Entity** (domain/entities/).
*   **MAPEO DE SALIDA:** El Service **JAMÁS** devuelve una Entity. **DEBE** transformar a **DTO de respuesta**.
*   **ORQUESTACIÓN:** En procesos complejos de negocio, usar **Service de Fachada**. **PROHIBIDA** la lógica de negocio pesada en Controllers.

## 4.1. Seguridad y Atomicidad
*   **ATOMICIDAD (QUERYRUNNER):** Operaciones multi-tabla **DEBEN** usar **QueryRunner** con Start/Commit/Rollback explícito. Prohibido confiar en transacciones implícitas.
*   **TENANT ISOLATION (JWT):** El identificador de contexto (ej. `project_id`, `taller_id`) se extrae **EXCLUSIVAMENTE** del JWT decodificado. **PROHIBIDO** confiar en el ID enviado en el body.
*   **PRECISIÓN FINANCIERA:** **PROHIBIDO** el uso de flotantes. Manejo exclusivo en **CÉNTIMOS (ENTEROS)** en DB y lógica.

## 8.1. Base de Datos Scale-First
*   **RENAME LAW:** Durante refactorización, **PROHIBIDO** el `DROP COLUMN`. Se **DEBE** usar `RENAME COLUMN` para asegurar trazabilidad de data.
*   **REGLA 200ms:** Consultas que tarden más de 200ms son bugs de rendimiento. Deben optimizarse con índices.
*   **RELACIONES:** Prohibido `{ eager: true }`. Carga explícita siempre en el Service o QueryBuilder.