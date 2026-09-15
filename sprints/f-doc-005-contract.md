# Sprint F-DOC-005: Wave client-mediated review MCP

## What
La documentación pública debe permitir elegir entre el MCP determinista de
Wave y el MCP de revisión razonada, explicando que el segundo ejecuta el LLM en
el host del cliente y encadena cinco stages read-only.

## Implementation
- Añadir la operación pública de Wave Review a la referencia API.
- Documentar configuración OpenCode, autenticación y responsabilidad de tokens/coste.
- Documentar el ciclo Start -> Interpret -> Submit -> Repeat -> Final y sus límites.
- Sincronizar `public/llms.txt` y conservar la frontera analysis-only.

## Test plan
1. Navegar a `/documentation`.
2. Verificar los dos endpoints MCP y sus diferencias.
3. Expandir la operación Wave Review y comprobar tools, contrato y boundary.
4. Verificar que el ejemplo OpenCode usa una variable de entorno y no un token real.
5. Filtrar por `review` y comprobar que solo queda la operación nueva.
6. Validar desktop y mobile sin overflow ni errores de consola.

## Pass criteria
- La referencia pública describe exactamente el endpoint `wave/review/mcp` y sus dos tools.
- `public/llms.txt` contiene la misma información sin secretos ni datos internos.
- Vitest, build Astro y Playwright pasan.
- La evaluación visual alcanza al menos 3/5 en calidad, originalidad, craft y funcionalidad.
