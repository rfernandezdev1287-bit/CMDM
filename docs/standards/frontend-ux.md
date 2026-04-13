# 🎨 RFDEV-Architect-Law: Frontend & UX/UI

## 3.1. Design System (MUI v7)
*   **TOKENS DE DISEÑO:** **PROHIBIDO** usar valores estáticos (`px`, `hex`). Uso exclusivo del `theme.js`.
*   **TYPOGRAPHY FIRST:** **PROHIBIDO** etiquetas nativas (`h1`, `p`). Uso exclusivo de `<Typography variant="...">`.
*   **ESTÉTICA GOLD:** Superficies con jerarquía visual mediante elevación, `backdrop-filter: blur(16px)` y transparencias alpha calculadas.

## 3.3. Rendimiento y Estabilidad
*   **ANTI-LAYOUT SHIFT (CLS):** **SKELETONS OBLIGATORIOS** con dimensiones físicas exactas (height/width) del componente final.
*   **FORMULARIOS:** Uso **EXCLUSIVO** de **React Hook Form + Yup/Zod**. Prohibido el `useState` manual para formularios complejos.
*   **AUTO-REFETCH:** Las mutaciones (POST/PUT/DELETE) exitosas deben disparar actualización automática de la data en las vistas relacionadas.
*   **VISUAL CoT:** Prever siempre tres estados: Loading, Empty, y Error.