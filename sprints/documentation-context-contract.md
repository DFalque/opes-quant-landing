# Sprint F-DOC-002: Contexto de la fachada Wave

## What

Ampliar `/documentation` para que no solo muestre cómo llamar a Wave, sino que
explique qué cambió en `v0.4.0`, cómo la fachada compacta se transforma en un
análisis v2, qué significa cada bloque de evidencia y cómo debe interpretarlo un
consumidor humano o un agente de IA.

## Implementation

- Explicar fachada pública, contrato interno y ruta legacy sin exponer secretos.
- Documentar el flujo `market` + `ticker` → defaults server-side → Link → validación → cálculo → response.
- Añadir el diccionario de `structure`, Fibonacci, Fan, Pitchfan, volumen y provenance.
- Diferenciar `ok`, `partial`, estados PIT y freshness de cualquier señal de mercado.
- Publicar una política pseudo-JSON para agentes: preservar ausencias, leer provenance primero y no inferir órdenes.
- Mantener la identidad visual actual y el layout responsive.

## Test plan (Playwright)

1. Navegar a `/documentation`.
2. Comprobar que aparecen el cambio `v0.4.0`, el contrato legacy y el endpoint compacto.
3. Comprobar el flujo de seis pasos, las cinco perspectivas y el diccionario de response.
4. Comprobar la guía para IA y el campo `forbidden_inference`.
5. Validar desktop y mobile sin overflow horizontal ni secretos.

## Pass criteria

- La página se construye sin errores.
- El contrato público sigue siendo exacto: solo `market` y `ticker` en la request.
- La documentación explica las limitaciones temporales y no presenta `partial` como señal.
- La guía para IA deja explícito que Wave es un proveedor de contexto técnico y no de ejecución.
- Las verificaciones visuales y funcionales pasan en desktop y mobile.
