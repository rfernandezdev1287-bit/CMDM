### 🚀 PLAN DE VUELO: ST-03 (Dashboard UI & Mando de Cristal)

**1. 🧠 INGESTIÓN DE MEMORIA (Lecciones de Guerra):**
*Sintetizado de .agent/engram/session_history.md:*
- "Éxito previo: Hooks de Voz y Sockets materializados y testeados vía ngrok (Status 200)."
- "Falla evitada: No se usarán archivos .css externos; toda la estética se inyectará vía SX Props y el Theme Gold."

**2. 📑 TRAZABILIDAD DE DOCUMENTACIÓN (Source of Truth):**
- **Requerimiento:** `docs/requirements/03_especificacion_funcional.md` -> [RF-01: Dual Chat], [RF-02: Input Inteligente], [RF-11/12: Controles de Audio].
- **Estándares Aplicados:** `docs/standards/frontend-ux.md` -> [Módulo 3.3: Anti-Layout Shift (Skeletons)].
- **Módulos Afectados:** `frontend/src/presentation/components/Dashboard/`.

**3. 🏛️ FASE SOCRÁTICA (Análisis de Riesgos):**
- **Duda Metódica:** "¿Cómo dividimos la pantalla en móvil para que el chat de Anti-Gravity y el de Ollama no se pisen?"
- **Solución:** Implementaremos un sistema de Tabs táctiles o un Scroll Dividido con altura fija para mantener el control visual.
- **Punto de Falla:** El teclado móvil puede tapar el input de mando. *Acción: Usar `position: sticky` o `fixed` en la base de la pantalla para el área de comandos.*

**4. 🧪 FÓRMULA TÉCNICA (Inducción Activa):**
"Construiremos el `Dashboard.tsx` usando una estructura de Atómic Design. Separaremos el MonitorDual (visualización) del PanelDeMando (inputs). Usaremos `Stack` de MUI para el espaciado técnico y `GlassCard` (componente reutilizable) para las superficies con blur."

**5. 🚦 TABLA DE ESTADOS:**
| ID | Tarea Atómica | Requerimiento | Estado |
|:---|:---|:---|:---:|
| T-01 | Interfaz | Creación de Componente GlassCard base | 🔴 PENDIENTE |
| T-02 | Interfaz | Implementación de DualStreamViewer (Logs en tiempo real) | 🔴 PENDIENTE |
| T-03 | Interfaz | Consola de Mando (Mic, Send, Squeeze buttons) | 🔴 PENDIENTE |
| T-04 | Hardware | Enchufe de useCMDM_Voice a los botones de la UI | 🔴 PENDIENTE |
